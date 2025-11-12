package com.intelligent.missingperson.dto;

import java.time.LocalDateTime;

import jakarta.persistence.PrePersist;
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
    
    private Integer missingDocumentId;

    private Integer volunteerId;

    private LocalDateTime reportTime;

    private String sightingPicture;

    private Integer sightingAreaId;

    private String description;

    @PrePersist
    protected void onCreate() {
        if (reportTime == null) reportTime = LocalDateTime.now();
    }
}
