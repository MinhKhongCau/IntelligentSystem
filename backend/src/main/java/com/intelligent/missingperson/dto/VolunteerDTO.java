package com.intelligent.missingperson.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VolunteerDTO {
    private Integer id;
    private Integer accountId;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String profilePictureUrl;
    private LocalDate dateJoined;
    private String skills;
    private Double rating;
    private Boolean volunteerStatus;
}
