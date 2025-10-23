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
@Table(name = "SightingReport")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SightingReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Reporter", nullable = false)
    private Account reporter;

    @Column(name = "SightingTimestamp", nullable = false)
    private Date sightingTimestamp;

    @Column(name = "CapturedImageURL")
    private String capturedImageURL;

    @NotBlank(message = "Description is required")
    @Column(name = "Description", columnDefinition = "TEXT", nullable = false)
    private String description;

    @NotBlank(message = "VerificationStatus is required")
    @Size(max = 50, message = "VerificationStatus must not exceed 50 characters")
    @Column(name = "VerificationStatus", nullable = false)
    private String verificationStatus; // Unverified, Verified, FalseAlarm

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_SightingArea", nullable = false)
    private Area sightingArea;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_MissingProfile")
    private MissingProfile missingProfile; // Can be null if volunteer reports a stranger
}

