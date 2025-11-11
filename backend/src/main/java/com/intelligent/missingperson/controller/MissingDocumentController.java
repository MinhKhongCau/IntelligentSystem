package com.intelligent.missingperson.controller;

import com.intelligent.missingperson.dto.MissingDocumentRequest;
import com.intelligent.missingperson.dto.MissingDocumentResponseDTO;
import com.intelligent.missingperson.dto.ReportMissingDTO;
import com.intelligent.missingperson.entity.*;
import com.intelligent.missingperson.service.AreaService;
import com.intelligent.missingperson.service.CarePartnerService;
import com.intelligent.missingperson.service.MissingDocumentService;
import com.intelligent.missingperson.service.PictureService;
import com.intelligent.missingperson.service.VolunteerService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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

    private static final int MIN_SQL_DATETIME_YEAR = 1753;

    @Autowired
    private PictureService pictureService;

    @Autowired
    private VolunteerService volunteerService;

    @GetMapping
    public ResponseEntity<?> getAllMissingDocuments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String name) { // This name is for filtering, not the DTO field
        try {
            List<MissingDocumentResponseDTO> documents;
            if (name != null && !name.isBlank()) {
                documents = missingDocumentService.findByFullNameContaining(name);
            } else {
                documents = missingDocumentService.findAll();
            }
            return ResponseEntity.ok(documents); // This will now return List<MissingDocumentResponseDTO>
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
        ResponseEntity<?> validationError = validateDateTimeFields(request);
        if (validationError != null) {
            return validationError;
        }

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
        ResponseEntity<?> validationError = validateDateTimeFields(request);
        if (validationError != null) {
            return validationError;
        }

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

            ResponseEntity<?> validationError = validateDateTimeFields(request);
            if (validationError != null) {
                return validationError;
            }
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
            try {
                String savedImagePath = pictureService.storeImageFile(image);
                request.setFacePictureUrl(savedImagePath);
            } catch (Exception ioe) {
                return ResponseEntity.internalServerError().body("Failed to save image");
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

    @PostMapping(
        path = "/subcribe",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> subscribeMissingDocument(
            @RequestParam("missing_document_id") Integer missingDocumentId,
            @RequestParam("volunteer_id") Integer volunteerId
    ) {
        // This method can reuse the addPersonFromForm logic
        if (missingDocumentId == null) {
            return ResponseEntity.badRequest().body("MissingDocument ID is required in the report.");
        }
        if (volunteerId == null) {
            return ResponseEntity.badRequest().body("Volunteer ID is required in the report.");
        }
        Optional<MissingDocument> missingDocOpt = missingDocumentService.findById(missingDocumentId);
        Optional<Volunteer> volunteerOpt = volunteerService.findById(volunteerId);
        if (missingDocOpt.isEmpty() || volunteerOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Something not found with id: " + volunteerId);
        }
        VolunteerSubscription volunteerSubscription = VolunteerSubscription.builder()
                .missingDocument(missingDocOpt.get())
                .volunteer(volunteerOpt.get())
                .subscribedDate(LocalDateTime.now())
                .isActive(true)
                .build();
        
        missingDocumentService.saveSubcription(volunteerSubscription);
        return ResponseEntity.status(201).body("Volunteer subscription successfully.");
    }

    @PostMapping(
        path = "/submit-missing-person",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> submitMissingPerson(
            @ModelAttribute @Valid ReportMissingDTO request,
            BindingResult bindingResult,
            @RequestParam(value = "sighting_picture", required = false) MultipartFile image
    ) {
        // This method can reuse the addPersonFromForm logic
        if (bindingResult.hasErrors()) {
            StringBuilder sb = new StringBuilder();
            bindingResult.getFieldErrors().forEach(fe -> sb.append(fe.getField()).append(": ").append(fe.getDefaultMessage()).append("; "));
            return ResponseEntity.badRequest().body("Validation failed: " + sb.toString());
        }
        if (request.getId() == null) {
            return ResponseEntity.badRequest().body("MissingDocument ID is required in the report.");
        }
        Optional<MissingDocument> missingDocOpt = missingDocumentService.findById(request.getMissingDocumentId());
        Optional<Area> areaOpt = areaService.findById(request.getSightingAreaId());
        Optional<Volunteer> volunteerOpt = volunteerService.findById(request.getVolunteerId());
        if (missingDocOpt.isEmpty() || areaOpt.isEmpty() || volunteerOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Something not found with id: " + request.getMissingDocumentId());
        }
        VolunteerReport volunteerReport = VolunteerReport.builder()
                .missingDocument(missingDocOpt.get())
                .volunteer(volunteerOpt.get())
                .reportTime(request.getReportTime() != null ? request.getReportTime() : LocalDateTime.now())
                .sightingPicture(request.getSightingPicture())
                .sightingArea(areaOpt.get())
                .description(request.getDescription())
                .build();
        missingDocumentService.saveVolunteerReport(volunteerReport);
        return ResponseEntity.status(201).body("Volunteer report submitted successfully.");
    }

    private ResponseEntity<?> validateDateTimeFields(MissingDocumentRequest request) {
        // Validate birthday
        if (request.getBirthday() != null && request.getBirthday().getYear() < MIN_SQL_DATETIME_YEAR) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Birthday year cannot be before " + MIN_SQL_DATETIME_YEAR + " due to database limitations.");
        }

        // Validate missingTime
        if (request.getMissingTime() != null && request.getMissingTime().getYear() < MIN_SQL_DATETIME_YEAR) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Missing time year cannot be before " + MIN_SQL_DATETIME_YEAR + " due to database limitations.");
        }

        return null; // No validation errors
    }
}