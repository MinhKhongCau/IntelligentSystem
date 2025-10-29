package com.intelligent.missingperson.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MissingDocumentResponseDTO {
    private Integer id;
    private String name; // Corresponds to fullName in entity
    private LocalDate birthday;
    private Boolean gender;
    private String identityCardNumber;
    private String height;
    private String weight;
    private String identifyingCharacteristic;
    private String lastKnownOutfit;
    private String medicalConditions;
    private String facePictureUrl;
    private LocalDateTime missingTime;
    private LocalDateTime reportDate;
    private String reporterRelationship;
    private AreaDTO missingArea; // Full Area object for display
    private Integer reporterId; // Only ID needed for reporter
    private String caseStatus;
}