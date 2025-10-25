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
    @Column(name = "id")
    @EqualsAndHashCode.Include
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_missing_document", nullable = false)
    private MissingDocument missingDocument;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_volunteer", nullable = false)
    private Volunteer volunteer;

    @Column(name = "report_time", nullable = false)
    private LocalDateTime reportTime;

    @Lob
    @Column(name = "sighting_picture")
    private String sightingPicture;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sighting_area_id")
    private Area sightingArea;

    @Column(name = "latitude", precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 9, scale = 6)
    private BigDecimal longitude;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "report_status", nullable = false, length = 50)
    @Builder.Default
    private String reportStatus = "Submitted";

    @PrePersist
    protected void onCreate() {
        if (reportTime == null) reportTime = LocalDateTime.now();
        if (reportStatus == null) reportStatus = "Submitted";
    }
}