package com.intelligent.missingperson.controller;

import com.intelligent.missingperson.dto.MissingDocumentRequest;
import com.intelligent.missingperson.entity.*;
import com.intelligent.missingperson.service.AreaService;
import com.intelligent.missingperson.service.CarePartnerService;
import com.intelligent.missingperson.service.MissingDocumentService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/missing-documents")
@CrossOrigin(origins = "*")
public class MissingDocumentController {

    @Autowired
    private MissingDocumentService missingDocumentService;

    @Autowired
    private AreaService areaService;

    @Autowired
    private CarePartnerService carePartnerService;

    @GetMapping
    public ResponseEntity<?> getAllMissingDocuments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String name) {
        try {
            List<MissingDocument> documents;
            if (name != null && !name.isBlank()) {
                documents = missingDocumentService.findByFullNameContaining(name);
            } else {
                documents = missingDocumentService.findAll();
            }
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error retrieving documents.");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMissingDocumentById(@PathVariable Integer id) {
        try {
            Optional<MissingDocument> document = missingDocumentService.findById(id);
            if (document.isEmpty()) {
                return ResponseEntity.internalServerError().body(String.format("Document not found with id: %d", id));
            }
            return ResponseEntity.ok(document.get());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error retrieving document: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createMissingDocument(@Valid @RequestBody MissingDocumentRequest request) {
        try {
            Optional<Area> areaOpt = areaService.findById(request.getMissingAreaId());
            Optional<CarePartner> reporterOpt = carePartnerService.findById(request.getReporterId());

            if (areaOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("Area not found with id: " + request.getMissingAreaId());
            }

            if (reporterOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("Reporter not found with id: " + request.getReporterId());
            }

            MissingDocument missingDocument = MissingDocument.builder()
                    .fullName(request.getName())
                    .birthday(request.getBirthday())
                    .gender(request.getGender())
                    .identityCardNumber(request.getIdentityCardNumber())
                    .height(request.getHeight())
                    .weight(request.getWeight())
                    .identifyingCharacteristic(request.getIdentifyingCharacteristic())
                    .lastKnownOutfit(request.getLastKnownOutfit())
                    .medicalConditions(request.getMedicalConditions())
                    .facePictureUrl(request.getFacePictureUrl())
                    .missingTime(request.getMissingTime())
                    .reportDate(request.getReportDate() == null ? LocalDateTime.now() : request.getReportDate())
                    .reporterRelationship(request.getReporterRelationship())
                    .missingArea(areaOpt.get())
                    .reporter(reporterOpt.get())
                    .caseStatus("Missing")
                    .build();

            MissingDocument savedDocument = missingDocumentService.save(missingDocument);
            return ResponseEntity.ok("Document created successfully" + savedDocument);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error creating document: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMissingDocument(@PathVariable Integer id,
                                                 @Valid @RequestBody MissingDocumentRequest request) {
        try {
            Optional<MissingDocument> existingDoc = missingDocumentService.findById(id);
            if (existingDoc.isEmpty()) {
                return (ResponseEntity.internalServerError())
                        .body(String.format("Document not found with id: %d", id));
            }

            MissingDocument document = existingDoc.get();
            updateDocumentFields(document, request);

            if (request.getMissingAreaId() != null) {
                Optional<Area> area = areaService.findById(request.getMissingAreaId());
                if (area.isEmpty()) {
                    return ResponseEntity.badRequest()
                            .body("Area not found with id: " + request.getMissingAreaId());
                }
                document.setMissingArea(area.get());
            }

            MissingDocument updatedDocument = missingDocumentService.save(document);
            return ResponseEntity.ok("Document updated successfully" + updatedDocument);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error updating document: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMissingDocument(@PathVariable Integer id) {
        try {
            if (!missingDocumentService.existsById(id)) {
                return ResponseEntity.internalServerError()
                        .body("Document not found with id: " + id);
            }
            missingDocumentService.deleteById(id);
            return ResponseEntity.ok("Document deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error deleting document: " + e.getMessage());
        }
    }

    private void updateDocumentFields(MissingDocument document, MissingDocumentRequest request) {
        document.setFullName(request.getName());
        document.setBirthday(request.getBirthday());
        document.setGender(request.getGender());
        document.setIdentityCardNumber(request.getIdentityCardNumber());
        document.setHeight(request.getHeight());
        document.setWeight(request.getWeight());
        document.setIdentifyingCharacteristic(request.getIdentifyingCharacteristic());
        document.setLastKnownOutfit(request.getLastKnownOutfit());
        document.setMedicalConditions(request.getMedicalConditions());
        document.setFacePictureUrl(request.getFacePictureUrl());
        document.setMissingTime(request.getMissingTime());
        document.setUpdateDate(LocalDateTime.now());
        if (request.getReporterRelationship() != null) {
            document.setReporterRelationship(request.getReporterRelationship());
        }
    }

    @PostMapping(
        path = "/addperson",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> addPersonFromForm(
            @ModelAttribute @Valid MissingDocumentRequest request,
            BindingResult bindingResult,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            System.out.println("---> Received request: " + request);
            // validate DTO binding
            if (bindingResult.hasErrors()) {
                StringBuilder sb = new StringBuilder();
                bindingResult.getFieldErrors().forEach(fe -> sb.append(fe.getField()).append(": ").append(fe.getDefaultMessage()).append("; "));
                return ResponseEntity.badRequest().body("Validation failed: " + sb.toString());
            }

            // ensure referenced area and reporter exist
            Optional<Area> areaOpt = areaService.findById(request.getMissingAreaId());
            if (areaOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Area not found with id: " + request.getMissingAreaId());
            }
            Optional<CarePartner> reporterOpt = carePartnerService.findById(request.getReporterId());
            if (reporterOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Reporter not found with id: " + request.getReporterId());
            }

            // if an image file provided, store it and override facePictureUrl
            String savedImagePath = null;
            if (image != null && !image.isEmpty()) {
                File uploadDir = new File("uploads");
                if (!uploadDir.exists()) uploadDir.mkdirs();

                String ext = "";
                String original = image.getOriginalFilename();
                if (original != null && original.contains(".")) {
                    ext = original.substring(original.lastIndexOf('.'));
                }
                String filename = "missing_" + UUID.randomUUID() + ext;
                File target = new File(uploadDir, filename);
                try {
                    Files.copy(image.getInputStream(), target.toPath(), StandardCopyOption.REPLACE_EXISTING);
                    savedImagePath = "/uploads/" + filename;
                    // override DTO value
                    request.setFacePictureUrl(savedImagePath);
                } catch (IOException ioe) {
                    return ResponseEntity.internalServerError().body("Failed to save image");
                }
            }

            // facePictureUrl is required by DTO - ensure present
            if (request.getFacePictureUrl() == null || request.getFacePictureUrl().isBlank()) {
                return ResponseEntity.badRequest().body("Face picture url is required (file upload or URL)");
            }

            // Build entity and persist
            MissingDocument missingDocument = MissingDocument.builder()
                    .fullName(request.getName())
                    .birthday(request.getBirthday())
                    .gender(request.getGender())
                    .identityCardNumber(request.getIdentityCardNumber())
                    .height(request.getHeight())
                    .weight(request.getWeight())
                    .identifyingCharacteristic(request.getIdentifyingCharacteristic())
                    .lastKnownOutfit(request.getLastKnownOutfit())
                    .medicalConditions(request.getMedicalConditions())
                    .facePictureUrl(request.getFacePictureUrl())
                    .missingTime(request.getMissingTime())
                    .reportDate(request.getReportDate() == null ? LocalDateTime.now() : request.getReportDate())
                    .reporterRelationship(request.getReporterRelationship())
                    .missingArea(areaOpt.get())
                    .reporter(reporterOpt.get())
                    .caseStatus("Missing")
                    .build();

            MissingDocument saved = missingDocumentService.save(missingDocument);
            return ResponseEntity.status(201).body(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error creating missing person: " + e.getMessage());
        }
    }
}