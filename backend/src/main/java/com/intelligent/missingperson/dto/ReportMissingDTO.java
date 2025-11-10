package com.intelligent.missingperson.dto;

import java.time.LocalDateTime;

import jakarta.persistence.PrePersist;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportMissingDTO {
    private Integer id;
    @NotBlank(message = "Missing document ID is required")
    private Integer missingDocumentId;

    @NotBlank(message = "Volunteer ID is required")
    private Integer volunteerId;

    private LocalDateTime reportTime;

    private String sightingPicture;

    @NotBlank(message = "Area is required")
    private Integer sightingAreaId;

    private String description;

    @PrePersist
    protected void onCreate() {
        if (reportTime == null) reportTime = LocalDateTime.now();
    }
}
