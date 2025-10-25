package com.intelligent.missingperson.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Username is required")
    @Size(max = 255)
    private String username;

    @NotBlank(message = "Password is required")
    @Size(max = 255)
    private String password;

    @NotBlank(message = "Email is required")
    @Email
    @Size(max = 255)
    private String email;

    @NotBlank(message = "Full name is required")
    @Size(max = 255)
    private String fullName;

    private LocalDate birthday;

    @Size(max = 1000)
    private String address;

    private Boolean gender;

    @Size(max = 20)
    private String phone;

    @Size(max = 1000)
    private String profilePictureUrl;
}