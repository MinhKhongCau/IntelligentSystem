package com.intelligent.missingperson.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CctvReportDTO {
    private Integer id;
    private Integer cctvId;
    @JsonAlias({"cctvIp","cctv_ip","ip","camera_ip"})
    private String cctvIp;
    private String cctvName;
    @JsonAlias({"missing_document_id","person_id","personId","missingDocumentId"})
    private Integer missingDocumentId;
    private LocalDateTime timeReport;
    private String detail;
    @JsonAlias({"confidence","confident","distance","similarity"})
    private Double confident;
    @JsonAlias({"detectLog","detection_log","log"})
    private String detectionLog;
    @JsonAlias({"detect_picture","image","detectPicture"})
    private String detectPicture;
    private String confirmationStatus;
    // CCTV coordinates for map display
    private BigDecimal cctvLatitude;
    private BigDecimal cctvLongitude;
}
