package com.intelligent.missingperson.entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"cctv","missingDocument","policeReviewer"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "CCTV_REPORT")
public class CctvReport implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @EqualsAndHashCode.Include
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cctv")
    private Cctv cctv;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_missing_document")
    private MissingDocument missingDocument;

    @Lob
    @Column(name = "detail")
    private String detail;

    @Column(name = "time_report", nullable = false)
    private LocalDateTime timeReport;

    @Column(name = "confirmation_status", nullable = false, length = 50)
    @Builder.Default
    private String confirmationStatus = "Pending_Review";

    @Column(name = "confident")
    private Double confident;

    @Column(name = "detection_log", length = 255)
    private String detectionLog;

    @Lob
    @Column(name = "detect_picture")
    private String detectPicture;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_police_reviewer")
    private Police policeReviewer;

    @Column(name = "review_time")
    private LocalDateTime reviewTime;

    @Lob
    @Column(name = "review_notes")
    private String reviewNotes;

    @PrePersist
    protected void onCreate() {
        if (timeReport == null) timeReport = LocalDateTime.now();
        if (confirmationStatus == null) confirmationStatus = "Pending_Review";
    }
}