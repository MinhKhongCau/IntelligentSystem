package com.intelligent.missingperson.dto;

import java.util.List;

import com.intelligent.missingperson.until.Roles;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String accessToken;
    @Builder.Default
    private String tokenType = "Bearer";
    private AccountDTO accountDTO;
    private List<Roles> roles;
}