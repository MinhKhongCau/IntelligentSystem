package com.intelligent.missingperson.entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"missingArea","reporter","cctvReports","volunteerReports","manageDocuments","volunteerSubscriptions"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "MISSING_DOCUMENT")
public class MissingDocument implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    @EqualsAndHashCode.Include
    private Integer id;

    @Column(name = "FullName", nullable = false, length = 255)
    private String fullName;

    @Column(name = "Birthday")
    private LocalDate birthday;

    @Column(name = "Gender")
    private Boolean gender;

    @Column(name = "IdentityCardNumber", length = 100)
    private String identityCardNumber;

    @Column(name = "Height", length = 20)
    private String height;

    @Column(name = "Weight", length = 20)
    private String weight;

    @Lob
    @Column(name = "IdentifyingCharacteristic")
    private String identifyingCharacteristic;

    @Lob
    @Column(name = "LastKnownOutfit")
    private String lastKnownOutfit;

    @Lob
    @Column(name = "MedicalConditions")
    private String medicalConditions;

    @Lob
    @Column(name = "FacePictureUrl", nullable = false)
    private String facePictureUrl;

    @Column(name = "MissingTime", nullable = false)
    private LocalDateTime missingTime;

    @Column(name = "ReportDate", nullable = false)
    private LocalDateTime reportDate;

    @Column(name = "UpdateDate")
    private LocalDateTime updateDate;

    @Column(name = "CaseStatus", nullable = false, length = 50)
    @Builder.Default
    private String caseStatus = "Missing";

    @Column(name = "ReporterRelationship", length = 100)
    private String reporterRelationship;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_MissingArea")
    private Area missingArea;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Reporter")
    private CarePartner reporter;

    @OneToMany(mappedBy = "missingDocument", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<CctvReport> cctvReports = new HashSet<>();

    @OneToMany(mappedBy = "missingDocument", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<VolunteerReport> volunteerReports = new HashSet<>();

    @OneToMany(mappedBy = "missingDocument", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<ManageDocument> manageDocuments = new HashSet<>();

    @OneToMany(mappedBy = "missingDocument", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<VolunteerSubscription> volunteerSubscriptions = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        if (reportDate == null) reportDate = LocalDateTime.now();
        if (caseStatus == null) caseStatus = "Missing";
    }
}