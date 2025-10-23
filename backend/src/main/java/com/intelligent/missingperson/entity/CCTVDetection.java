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
@Table(name = "CCTVDetection")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CCTVDetection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CCTV", nullable = false)
    private CCTV cctv;

    @Column(name = "DetectionTimestamp", nullable = false)
    private Date detectionTimestamp;

    @NotBlank(message = "DetectedImageURL is required")
    @Column(name = "DetectedImageURL", nullable = false)
    private String detectedImageURL;

    @Column(name = "Confidence")
    private Float confidence;

    @NotBlank(message = "VerificationStatus is required")
    @Size(max = 50, message = "VerificationStatus must not exceed 50 characters")
    @Column(name = "VerificationStatus", nullable = false)
    private String verificationStatus; // Unverified, Verified, FalseAlarm

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_MissingProfile")
    private MissingProfile missingProfile; // Can be null if AI only detects but doesn't match
}

