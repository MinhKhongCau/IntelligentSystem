package com.intelligent.missingperson.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MissingDocumentRequest {
    @NotBlank(message = "Name is required")
    private String name;

    private LocalDate birthday;

    private Boolean gender;

    private String identityCardNumber;

    private String height;

    private String weight;

    private String identifyingCharacteristic;

    private String lastKnownOutfit;

    private String medicalConditions;

    @NotBlank(message = "Face picture url is required")
    private String facePictureUrl;

    @NotNull(message = "Missing time is required")
    private LocalDateTime missingTime;

    private LocalDateTime reportDate;

    private String reporterRelationship;

    @NotNull(message = "Missing area id is required")
    private Integer missingAreaId;

    @NotNull(message = "Reporter id is required")
    private Integer reporterId;
}