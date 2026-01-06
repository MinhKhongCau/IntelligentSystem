package com.intelligent.missingperson.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CameraRequest {
    private String name;
    private String ip;
    private String streamUrl;
    private Integer port;
    private Integer locationId;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String cameraType;
    private String status;
}
