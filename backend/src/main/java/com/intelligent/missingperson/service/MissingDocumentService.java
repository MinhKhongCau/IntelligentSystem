package com.intelligent.missingperson.service;

import com.intelligent.missingperson.dto.MissingDocumentResponseDTO;
import com.intelligent.missingperson.dto.VolunteerReportDTO;
import com.intelligent.missingperson.dto.AreaDTO;
import com.intelligent.missingperson.dto.MissingDocumentRequest;
import com.intelligent.missingperson.entity.Area;
import com.intelligent.missingperson.entity.CarePartner;
import com.intelligent.missingperson.entity.MissingDocument;
import com.intelligent.missingperson.entity.VolunteerReport;
import com.intelligent.missingperson.entity.VolunteerSubscription;
import com.intelligent.missingperson.repository.MissingDocumentRepository;
import com.intelligent.missingperson.repository.VolunteerReportRepository;
import com.intelligent.missingperson.repository.VolunteerSubcriptionRepository;
import com.intelligent.missingperson.until.CaseStatus;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class MissingDocumentService {

    private final MissingDocumentRepository missingDocumentRepository;

    private final VolunteerReportRepository volunteerReportRepository;

    private final VolunteerSubcriptionRepository volunteerSubcriptionRepository;

    public List<MissingDocumentResponseDTO> findAll() {
        return missingDocumentRepository.findAll().stream()
                .map(this::mapToMissingDocumentResponseDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    public Page<MissingDocumentResponseDTO> findAllPaged(Pageable pageable, String name) {
        if (name != null && !name.isBlank()) {
            Page<MissingDocument> page = missingDocumentRepository.findByFullNameContaining(name, pageable);
            List<MissingDocumentResponseDTO> dtos = page.stream().map(this::mapToMissingDocumentResponseDTO).toList();
            return new PageImpl<>(dtos, pageable, page.getTotalElements());
        } else {
            Page<MissingDocument> page = missingDocumentRepository.findAll(pageable);
            List<MissingDocumentResponseDTO> dtos = page.stream().map(this::mapToMissingDocumentResponseDTO).toList();
            return new PageImpl<>(dtos, pageable, page.getTotalElements());
        }
    }

    /**
     * Search missing documents with optional filters. If multiple filters are provided,
     * name filter is applied first (via repository query) and remaining filters are applied in-memory
     * to the resulting page content.
     */
    public Page<MissingDocumentResponseDTO> searchPaged(Pageable pageable, String name, String status, Integer areaId, Integer reporterId) {
        Page<MissingDocument> basePage;
        if (name != null && !name.isBlank()) {
            basePage = missingDocumentRepository.findByFullNameContaining(name, pageable);
        } else if (status != null && !status.isBlank()) {
            // repository has findByCaseStatus returning a list (non-paged); adapt via in-memory paging
            List<MissingDocument> byStatus = missingDocumentRepository.findByCaseStatus(status);
            int start = (int) pageable.getOffset();
            int end = Math.min(start + pageable.getPageSize(), byStatus.size());
            List<MissingDocument> pageContent = start <= end ? byStatus.subList(start, end) : java.util.Collections.emptyList();
            List<MissingDocumentResponseDTO> dtos = pageContent.stream().map(this::mapToMissingDocumentResponseDTO).toList();
            return new PageImpl<>(dtos, pageable, byStatus.size());
        } else if (areaId != null) {
            basePage = missingDocumentRepository.findByMissingAreaId(areaId, pageable);
        } else if (reporterId != null) {
            basePage = missingDocumentRepository.findByReporterId(reporterId, pageable);
        } else {
            basePage = missingDocumentRepository.findAll(pageable);
        }

        // convert base page to DTOs and apply additional in-memory filters if needed
        List<MissingDocument> baseList = basePage.getContent();
        java.util.stream.Stream<MissingDocument> stream = baseList.stream();
        if (status != null && !status.isBlank()) {
            stream = stream.filter(d -> status.equals(d.getCaseStatus()));
        }
        if (areaId != null) {
            stream = stream.filter(d -> d.getMissingArea() != null && areaId.equals(d.getMissingArea().getId()));
        }
        if (reporterId != null) {
            stream = stream.filter(d -> d.getReporter() != null && reporterId.equals(d.getReporter().getId()));
        }

        List<MissingDocumentResponseDTO> dtos = stream.map(this::mapToMissingDocumentResponseDTO).toList();
        // Note: totalElements set to dtos.size() which is the page-size-limited count; this is acceptable for simple filtering
        return new PageImpl<>(dtos, pageable, dtos.size());
    }

    public Optional<MissingDocument> findById(Integer id) {
        return missingDocumentRepository.findById(id);
    }

    public Optional<MissingDocumentResponseDTO> findByIdAsDTO(Integer id) {
        return missingDocumentRepository.findById(id)
                .map(this::mapToMissingDocumentResponseDTO);
    }

    public MissingDocument save (MissingDocument document) {
        return missingDocumentRepository.save(document);
    }

    public MissingDocument save(MissingDocumentRequest request, Area area, CarePartner reporter) {
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
                .missingArea(area)
                .reporter(reporter)
                .caseStatus(CaseStatus.Missing.name())
                .build();
        return missingDocumentRepository.save(missingDocument);
    }

    public void deleteById(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("ID must not be null for deletion.");
        }

        Optional<MissingDocument> missingDocumentOpt = missingDocumentRepository.findById(id);

        if (missingDocumentOpt.isPresent()) {
            MissingDocument missingDocument = missingDocumentOpt.get();
            missingDocument.setCaseStatus(CaseStatus.Verifying.name());
            missingDocumentRepository.save(missingDocument);
        } else {
            System.out.println("Warning: MissingDocument with ID " + id + " not found.");
        }
    }

    public boolean existsById(Integer id) {
        return missingDocumentRepository.existsById(id);
    }

    public List<MissingDocumentResponseDTO> findByFullNameContaining(String name) {
        if (name == null || name.isBlank()) {
            return new ArrayList<>();
        }
        
        return missingDocumentRepository.findByFullNameContaining(name).stream()
                .map(this::mapToMissingDocumentResponseDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    private MissingDocumentResponseDTO mapToMissingDocumentResponseDTO(MissingDocument document) {
        AreaDTO areaDTO = null;
        if (document.getMissingArea() != null) {
            areaDTO = AreaDTO.builder()
                    .id(document.getMissingArea().getId())
                    .commune(document.getMissingArea().getCommune())
                    .district(document.getMissingArea().getDistrict())
                    .province(document.getMissingArea().getProvince())
                    .country(document.getMissingArea().getCountry())
                    .latitude(document.getMissingArea().getLatitude())
                    .longitude(document.getMissingArea().getLongitude())
                    .build();
        }

        return MissingDocumentResponseDTO.builder()
                .id(document.getId())
                .name(document.getFullName()) // Map entity's fullName to DTO's name
                .birthday(document.getBirthday())
                .gender(document.getGender())
                .identityCardNumber(document.getIdentityCardNumber())
                .height(document.getHeight())
                .weight(document.getWeight())
                .identifyingCharacteristic(document.getIdentifyingCharacteristic())
                .lastKnownOutfit(document.getLastKnownOutfit())
                .medicalConditions(document.getMedicalConditions())
                .facePictureUrl(document.getFacePictureUrl())
                .missingTime(document.getMissingTime())
                .reportDate(document.getReportDate())
                .reporterRelationship(document.getReporterRelationship())
                .missingArea(areaDTO) // Use the AreaDTO
                .reporterId(document.getReporter() != null ? document.getReporter().getId() : null) // Get reporter ID
                .caseStatus(document.getCaseStatus())
                .build();
    }

    public VolunteerReport saveVolunteerReport(VolunteerReport volunteerReport) {
        return volunteerReportRepository.save(volunteerReport);
    }

    public VolunteerSubscription saveSubcription(VolunteerSubscription volunteerSubscription) {
        return volunteerSubcriptionRepository.save(volunteerSubscription);
    }

    public List<MissingDocumentResponseDTO> findSubscribedDocumentsByVolunteerId(Integer volunteerId) {
        return volunteerSubcriptionRepository.findByVolunteerIdAndIsActiveTrue(volunteerId)
                .stream()
                .map(subscription -> mapToMissingDocumentResponseDTO(subscription.getMissingDocument()))
                .collect(java.util.stream.Collectors.toList());
    }

    public Page<MissingDocumentResponseDTO> findSubscribedDocumentsByVolunteerIdPaged(Integer volunteerId, Pageable pageable) {
        Page<com.intelligent.missingperson.entity.VolunteerSubscription> page = volunteerSubcriptionRepository.findByVolunteerIdAndIsActiveTrue(volunteerId, pageable);
        List<MissingDocumentResponseDTO> dtos = page.stream()
                .map(subscription -> mapToMissingDocumentResponseDTO(subscription.getMissingDocument()))
                .toList();
        return new PageImpl<>(dtos, pageable, page.getTotalElements());
    }

    public boolean unsubscribeVolunteer(Integer missingDocumentId, Integer volunteerId) {
        Optional<VolunteerSubscription> subscriptionOpt = volunteerSubcriptionRepository
                .findByMissingDocumentIdAndVolunteerIdAndIsActiveTrue(missingDocumentId, volunteerId);
        
        if (subscriptionOpt.isPresent()) {
            VolunteerSubscription subscription = subscriptionOpt.get();
            subscription.setActive(false);
            volunteerSubcriptionRepository.save(subscription);
            return true;
        }
        return false;
    }

    public List<com.intelligent.missingperson.dto.VolunteerReportDTO> getReportsByMissingDocumentId(Integer missingDocumentId) {
        List<VolunteerReport> reports = volunteerReportRepository.findByMissingDocumentId(missingDocumentId);
        return reports.stream()
                .map(this::convertReportToDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    public Page<com.intelligent.missingperson.dto.VolunteerReportDTO> getReportsByVolunteerIdPaged(Integer volunteerId, Pageable pageable) {
        Page<VolunteerReport> page = volunteerReportRepository.findByVolunteerId(volunteerId, pageable);
        List<com.intelligent.missingperson.dto.VolunteerReportDTO> dtos = page.stream()
                .map(this::convertReportToDTO)
                .toList();
        return new PageImpl<>(dtos, pageable, page.getTotalElements());
    }

    // Overloaded: support optional filtering by report status or missing document name
    public Page<com.intelligent.missingperson.dto.VolunteerReportDTO> getReportsByVolunteerIdPaged(Integer volunteerId, String searchName, String reportStatus, Pageable pageable) {
        Page<VolunteerReport> page;
        if (reportStatus != null && !reportStatus.isBlank()) {
            page = volunteerReportRepository.findByVolunteerIdAndReportStatus(volunteerId, reportStatus, pageable);
        } else if (searchName != null && !searchName.isBlank()) {
            page = volunteerReportRepository.findByVolunteerIdAndMissingDocumentFullNameContaining(volunteerId, searchName, pageable);
        } else {
            page = volunteerReportRepository.findByVolunteerId(volunteerId, pageable);
        }
        List<com.intelligent.missingperson.dto.VolunteerReportDTO> dtos = page.stream()
                .map(this::convertReportToDTO)
                .toList();
        return new PageImpl<>(dtos, pageable, page.getTotalElements());
    }

    private VolunteerReportDTO convertReportToDTO(VolunteerReport report) {
        com.intelligent.missingperson.dto.AreaDTO areaDTO = null;
        if (report.getSightingArea() != null) {
            areaDTO = com.intelligent.missingperson.dto.AreaDTO.builder()
                    .id(report.getSightingArea().getId())
                    .commune(report.getSightingArea().getCommune())
                    .district(report.getSightingArea().getDistrict())
                    .province(report.getSightingArea().getProvince())
                    .country(report.getSightingArea().getCountry())
                    .latitude(report.getSightingArea().getLatitude())
                    .longitude(report.getSightingArea().getLongitude())
                    .build();
        }

        return com.intelligent.missingperson.dto.VolunteerReportDTO.builder()
                .id(report.getId())
                .missingDocumentId(report.getMissingDocument() != null ? report.getMissingDocument().getId() : null)
                .volunteerId(report.getVolunteer() != null ? report.getVolunteer().getId() : null)
                .volunteerName(report.getVolunteer() != null && report.getVolunteer().getAccount() != null 
                        ? report.getVolunteer().getAccount().getFullName() : "Unknown")
                .reportTime(report.getReportTime())
                .sightingPicture(report.getSightingPicture())
                .sightingArea(areaDTO)
                .latitude(report.getLatitude())
                .longitude(report.getLongitude())
                .description(report.getDescription())
                .reportStatus(report.getReportStatus())
                .build();
    }

    // Public wrapper to expose report conversion for controllers
    public com.intelligent.missingperson.dto.VolunteerReportDTO toReportDTO(VolunteerReport report) {
        return convertReportToDTO(report);
    }

    public void updateDocumentFields(MissingDocument document, MissingDocumentRequest request) {
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

	public MissingDocumentResponseDTO convertToDTO(MissingDocument updatedDocument) {
		return MissingDocumentResponseDTO.builder()
            .id(updatedDocument.getId())
            .name(updatedDocument.getFullName())
            .birthday(updatedDocument.getBirthday())
            .gender(updatedDocument.getGender())
            .identityCardNumber(updatedDocument.getIdentityCardNumber())
            .height(updatedDocument.getHeight())
            .weight(updatedDocument.getWeight())
            .identifyingCharacteristic(updatedDocument.getIdentifyingCharacteristic())
            .lastKnownOutfit(updatedDocument.getLastKnownOutfit())
            .medicalConditions(updatedDocument.getMedicalConditions())
            .facePictureUrl(updatedDocument.getFacePictureUrl())
            .missingTime(updatedDocument.getMissingTime())
            .reportDate(updatedDocument.getReportDate())
            .reporterRelationship(updatedDocument.getReporterRelationship())
            .caseStatus(updatedDocument.getCaseStatus())
            .build();
            
	}

    public void addPersonToChromaDB(Integer personId, String name, String imageUrl) throws Exception {
        String flaskUrl = System.getenv().getOrDefault("FLASK_SERVICE_URL", "http://localhost:5001");
        String apiUrl = flaskUrl + "/api/add-chroma";
        
        // Create JSON request
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        // Build request body as JSON
        java.util.Map<String, Object> requestBody = new java.util.HashMap<>();
        requestBody.put("person_id", personId.toString());
        requestBody.put("name", name);
        requestBody.put("image_url", imageUrl);
        
        // Add metadata
        java.util.Map<String, String> metadata = new java.util.HashMap<>();
        metadata.put("name", name);
        metadata.put("person_id", personId.toString());
        requestBody.put("metadata", metadata);
        
        HttpEntity<java.util.Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
        
        // Send request
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, requestEntity, String.class);
        
        if (response.getStatusCode().is2xxSuccessful()) {
            System.out.println("✓ Successfully added person " + personId + " to ChromaDB");
        } else {
            System.err.println("✗ Failed to add person to ChromaDB: " + response.getBody());
        }
    }
}