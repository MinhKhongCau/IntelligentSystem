package com.intelligent.missingperson.dto;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AccountDTO {
    private Integer id;
    private String username;
    private String email;
    private String fullName;
    private LocalDate birthday;
    private String address;
    private Boolean gender;
    private String phone;
    private String profilePictureUrl;
    private String accountType;
}