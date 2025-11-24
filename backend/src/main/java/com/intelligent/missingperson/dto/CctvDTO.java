package com.intelligent.missingperson.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CctvDTO {
    private Integer id;
    private String name;
    private String status;
    private String streamUrl;
    private String ip;
    private Integer port;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String cameraType;
    private LocalDateTime lastOnline;
    private Integer areaId;
    private String areaName;
}
