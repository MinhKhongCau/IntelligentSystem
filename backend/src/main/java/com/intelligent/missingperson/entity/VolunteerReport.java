package com.intelligent.missingperson.entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"missingDocument","volunteer","sightingArea"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "VOLUNTEER_REPORT")
public class VolunteerReport implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    @EqualsAndHashCode.Include
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_MissingDocument", nullable = false)
    private MissingDocument missingDocument;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Volunteer", nullable = false)
    private Volunteer volunteer;

    @Column(name = "ReportTime", nullable = false)
    private LocalDateTime reportTime;

    @Lob
    @Column(name = "SightingPicture")
    private String sightingPicture;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SightingAreaID")
    private Area sightingArea;

    @Column(name = "Latitude", precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(name = "Longitude", precision = 9, scale = 6)
    private BigDecimal longitude;

    @Lob
    @Column(name = "Description")
    private String description;

    @Column(name = "ReportStatus", nullable = false, length = 50)
    @Builder.Default
    private String reportStatus = "Submitted";

    @PrePersist
    protected void onCreate() {
        if (reportTime == null) reportTime = LocalDateTime.now();
        if (reportStatus == null) reportStatus = "Submitted";
    }
}