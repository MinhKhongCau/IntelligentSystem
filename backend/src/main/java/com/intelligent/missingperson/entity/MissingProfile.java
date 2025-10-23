package com.intelligent.missingperson.entity;

import java.util.Date;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "MissingProfile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MissingProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @NotBlank(message = "FullName is required")
    @Size(max = 255, message = "FullName must not exceed 255 characters")
    @Column(name = "FullName", nullable = false)
    private String fullName;

    @Column(name = "Birthdate")
    private Date birthdate;

    @Column(name = "Gender")
    private Boolean gender; // 0 = Female, 1 = Male

    @Size(max = 20, message = "IdentityCardNumber must not exceed 20 characters")
    @Column(name = "IdentityCardNumber", unique = true)
    private String identityCardNumber;

    @Size(max = 20, message = "Height must not exceed 20 characters")
    @Column(name = "Height")
    private String height;

    @Column(name = "IdentifyingFeatures", columnDefinition = "TEXT")
    private String identifyingFeatures;

    @NotBlank(message = "ReferenceFaceImageURL is required")
    @Column(name = "ReferenceFaceImageURL", nullable = false)
    private String referenceFaceImageURL;

    @Column(name = "MissingTimestamp", nullable = false)
    private Date missingTimestamp;

    @Column(name = "ReportedDate", nullable = false)
    private Date reportedDate;

    @NotBlank(message = "Status is required")
    @Size(max = 50, message = "Status must not exceed 50 characters")
    @Column(name = "Status", nullable = false)
    private String status; // Missing, Found, Suspended

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Reporter", nullable = false)
    private Account reporter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_LastSeenArea", nullable = false)
    private Area lastSeenArea;
}

