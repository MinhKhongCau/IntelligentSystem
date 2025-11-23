package com.intelligent.missingperson.controller;

import com.intelligent.missingperson.dto.MissingDocumentRequest;
import com.intelligent.missingperson.dto.MissingDocumentResponseDTO;
import com.intelligent.missingperson.entity.*;
import com.intelligent.missingperson.service.AreaService;
import com.intelligent.missingperson.service.CarePartnerService;
import com.intelligent.missingperson.service.MissingDocumentService;
import com.intelligent.missingperson.service.PictureService;
import com.intelligent.missingperson.service.VolunteerService;
import com.intelligent.missingperson.until.CaseStatus;

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
            Optional<MissingDocumentResponseDTO> document = missingDocumentService.findByIdAsDTO(id);
            if (document.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(String.format("Document not found with id: %d", id));
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

            MissingDocument savedDocument = missingDocumentService.save(request, areaOpt.get(), reporterOpt.get());
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
            missingDocumentService.updateDocumentFields(document, request);

            if (request.getMissingAreaId() != null) {
                Optional<Area> area = areaService.findById(request.getMissingAreaId());
                if (area.isEmpty()) {
                    return ResponseEntity.badRequest()
                            .body("Area not found with id: " + request.getMissingAreaId());
                }
                document.setMissingArea(area.get());
            }

            MissingDocument updatedDocument = missingDocumentService.save(document);
            MissingDocumentResponseDTO missingDocumentResponseDTO = missingDocumentService.convertToDTO(updatedDocument);
            return ResponseEntity.ok(missingDocumentResponseDTO);
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
        if (missingDocumentId == null) {
            return ResponseEntity.badRequest().body("MissingDocument ID is required.");
        }
        if (volunteerId == null) {
            return ResponseEntity.badRequest().body("Volunteer ID is required.");
        }
        
        Optional<MissingDocument> missingDocOpt = missingDocumentService.findById(missingDocumentId);
        Optional<Volunteer> volunteerOpt = volunteerService.findById(volunteerId);
        
        if (missingDocOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Missing document not found with id: " + missingDocumentId);
        }
        if (volunteerOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Volunteer not found with id: " + volunteerId);
        }
        
        VolunteerSubscriptionId subscriptionId = new VolunteerSubscriptionId(missingDocumentId, volunteerId);
        
        VolunteerSubscription volunteerSubscription = VolunteerSubscription.builder()
                .id(subscriptionId)
                .missingDocument(missingDocOpt.get())
                .volunteer(volunteerOpt.get())
                .subscribedDate(LocalDateTime.now())
                .isActive(true)
                .build();
        
        missingDocumentService.saveSubcription(volunteerSubscription);
        return ResponseEntity.status(201).body("Volunteer subscription successfully.");
    }

    @GetMapping("/subscriptions/{volunteerId}")
    public ResponseEntity<?> getSubscribedDocuments(@PathVariable Integer volunteerId) {
        try {
            Optional<Volunteer> volunteerOpt = volunteerService.findById(volunteerId);
            if (volunteerOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Volunteer not found with id: " + volunteerId);
            }
            
            List<MissingDocumentResponseDTO> subscribedDocuments = missingDocumentService.findSubscribedDocumentsByVolunteerId(volunteerId);
            return ResponseEntity.ok(subscribedDocuments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error retrieving subscribed documents: " + e.getMessage());
        }
    }

    @DeleteMapping("/subscriptions/{missingDocumentId}/{volunteerId}")
    public ResponseEntity<?> unsubscribeFromDocument(
            @PathVariable Integer missingDocumentId,
            @PathVariable Integer volunteerId
    ) {
        try {
            boolean success = missingDocumentService.unsubscribeVolunteer(missingDocumentId, volunteerId);
            if (success) {
                return ResponseEntity.ok("Successfully unsubscribed from document.");
            } else {
                return ResponseEntity.badRequest().body("Subscription not found or already inactive.");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error unsubscribing: " + e.getMessage());
        }
    }

    @GetMapping("/reports/{missingDocumentId}")
    public ResponseEntity<?> getReportsByMissingDocumentId(@PathVariable Integer missingDocumentId) {
        try {
            if (!missingDocumentService.existsById(missingDocumentId)) {
                return ResponseEntity.badRequest()
                        .body("Missing document not found with id: " + missingDocumentId);
            }
            
            List<com.intelligent.missingperson.dto.VolunteerReportDTO> reports = 
                    missingDocumentService.getReportsByMissingDocumentId(missingDocumentId);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error retrieving reports: " + e.getMessage());
        }
    }

    @PostMapping(
        path = "/submit-missing-person",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> submitMissingPerson(
            @RequestParam("missingDocumentId") Integer missingDocumentId,
            @RequestParam("volunteerId") Integer volunteerId,
            @RequestParam("description") String description,
            @RequestParam(value = "sightingPicture", required = false) String sightingPicture,
            @RequestParam("sightingAreaId") Integer sightingAreaId
    ) {
        if (missingDocumentId == null) {
            return ResponseEntity.badRequest().body("Missing document ID is required.");
        }
        if (volunteerId == null) {
            return ResponseEntity.badRequest().body("Volunteer ID is required.");
        }
        if (description == null || description.isBlank()) {
            return ResponseEntity.badRequest().body("Description is required.");
        }
        if (sightingAreaId == null) {
            return ResponseEntity.badRequest().body("Sighting area ID is required.");
        }
        
        Optional<MissingDocument> missingDocOpt = missingDocumentService.findById(missingDocumentId);
        Optional<Area> areaOpt = areaService.findById(sightingAreaId);
        Optional<Volunteer> volunteerOpt = volunteerService.findById(volunteerId);
        
        if (missingDocOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Missing document not found with id: " + missingDocumentId);
        }
        if (areaOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Area not found with id: " + sightingAreaId);
        }
        if (volunteerOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Volunteer not found with id: " + volunteerId);
        }
        
        VolunteerReport volunteerReport = VolunteerReport.builder()
                .missingDocument(missingDocOpt.get())
                .volunteer(volunteerOpt.get())
                .reportTime(LocalDateTime.now())
                .sightingPicture(sightingPicture)
                .sightingArea(areaOpt.get())
                .description(description)
                .build();
        missingDocumentService.saveVolunteerReport(volunteerReport);
        return ResponseEntity.status(201).body("Volunteer report submitted successfully.");
    }

    @PutMapping("/{id}/mark-found")
    public ResponseEntity<?> markAsFound(@PathVariable Integer id) {
        try {
            Optional<MissingDocument> existingDoc = missingDocumentService.findById(id);
            if (existingDoc.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(String.format("Document not found with id: %d", id));
            }

            MissingDocument document = existingDoc.get();
            
            // Only allow marking as found if currently missing
            if (!"Missing".equals(document.getCaseStatus())) {
                return ResponseEntity.badRequest()
                        .body("Can only mark documents with 'Missing' status as found. Current status: " + document.getCaseStatus());
            }

            document.setCaseStatus(CaseStatus.Found.name());
            document.setUpdateDate(LocalDateTime.now());
            
            MissingDocument updatedDocument = missingDocumentService.save(document);
            MissingDocumentResponseDTO responseDTO = missingDocumentService.convertToDTO(updatedDocument);
            
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error marking document as found: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/update-status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Integer id,
            @RequestParam String status) {
        try {
            // Validate status
            if (!List.of("Missing", "Found", "Rejected", "Accepted").contains(status)) {
                return ResponseEntity.badRequest()
                        .body("Invalid status. Allowed values: Missing, Found, Rejected, Accepted");
            }

            Optional<MissingDocument> existingDoc = missingDocumentService.findById(id);
            if (existingDoc.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(String.format("Document not found with id: %d", id));
            }

            MissingDocument document = existingDoc.get();
            document.setCaseStatus(status);
            document.setUpdateDate(LocalDateTime.now());
            
            MissingDocument updatedDocument = missingDocumentService.save(document);
            MissingDocumentResponseDTO responseDTO = missingDocumentService.convertToDTO(updatedDocument);
            
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error updating document status: " + e.getMessage());
        }
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