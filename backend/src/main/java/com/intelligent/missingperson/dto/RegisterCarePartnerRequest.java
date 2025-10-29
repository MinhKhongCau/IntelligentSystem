package com.intelligent.missingperson.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterCarePartnerRequest {
    @Size(min = 3, max = 50, message = "Position in organization out of range (3 - 50 character)")
    private String partnerType;
    
    @Size(min = 3, max = 50, message = "Organization out of range (3 - 50 character)")
    private String organizationName;
}