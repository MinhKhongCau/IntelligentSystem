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
public class AreaDTO {
    private Integer id;
    private String commune;
    private String district;
    private String province;
    private String country;
    private BigDecimal latitude;
    private BigDecimal longitude;
}