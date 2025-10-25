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
    @Column(name = "id")
    @EqualsAndHashCode.Include
    private Integer id;

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(name = "birthday")
    private LocalDate birthday;

    @Column(name = "gender")
    private Boolean gender;

    @Column(name = "identity_card_number", length = 100)
    private String identityCardNumber;

    @Column(name = "height", length = 20)
    private String height;

    @Column(name = "weight", length = 20)
    private String weight;

    @Lob
    @Column(name = "identifying_characteristic")
    private String identifyingCharacteristic;

    @Lob
    @Column(name = "last_known_outfit")
    private String lastKnownOutfit;

    @Lob
    @Column(name = "medical_conditions")
    private String medicalConditions;

    @Lob
    @Column(name = "face_picture_url", nullable = false)
    private String facePictureUrl;

    @Column(name = "missing_time", nullable = false)
    private LocalDateTime missingTime;

    @Column(name = "report_date", nullable = false)
    private LocalDateTime reportDate;

    @Column(name = "update_date")
    private LocalDateTime updateDate;

    @Column(name = "case_status", nullable = false, length = 50)
    @Builder.Default
    private String caseStatus = "Missing";

    @Column(name = "reporter_relationship", length = 100)
    private String reporterRelationship;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_missing_area")
    private Area missingArea;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_reporter")
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