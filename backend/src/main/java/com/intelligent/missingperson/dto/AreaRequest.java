package com.intelligent.missingperson.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AreaRequest {
    private String commune;
    private String district;
    private String province;
    @NotBlank
    private String country;
    @NotNull
    private BigDecimal latitude;

    @NotNull
    private BigDecimal longitude;
}