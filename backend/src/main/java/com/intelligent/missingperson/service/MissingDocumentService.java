package com.intelligent.missingperson.service;

import com.intelligent.missingperson.dto.MissingDocumentResponseDTO;
import com.intelligent.missingperson.dto.AreaDTO;
import com.intelligent.missingperson.entity.MissingDocument;
import com.intelligent.missingperson.repository.MissingDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MissingDocumentService {

    private final MissingDocumentRepository missingDocumentRepository;

    public List<MissingDocumentResponseDTO> findAll() {
        return missingDocumentRepository.findAll().stream()
                .map(this::mapToMissingDocumentResponseDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    public Optional<MissingDocument> findById(Integer id) {
        return missingDocumentRepository.findById(id);
    }

    public MissingDocument save(MissingDocument document) {
        return missingDocumentRepository.save(document);
    }

    public void deleteById(Integer id) {
        missingDocumentRepository.deleteById(id);
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
}