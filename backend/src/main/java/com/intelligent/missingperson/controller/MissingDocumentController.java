package com.intelligent.missingperson.controller;

import com.intelligent.missingperson.dto.MissingDocumentRequest;
import com.intelligent.missingperson.entity.*;
import com.intelligent.missingperson.service.AreaService;
import com.intelligent.missingperson.service.CarePartnerService;
import com.intelligent.missingperson.service.MissingDocumentService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping
    public ResponseEntity<?> getAllMissingDocuments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy) {
        try {
            List<MissingDocument> documents = missingDocumentService.findAll();
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
}