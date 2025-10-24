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
    @Column(name = "ID")
    @EqualsAndHashCode.Include
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CCTV")
    private Cctv cctv;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_MissingDocument")
    private MissingDocument missingDocument;

    @Lob
    @Column(name = "Detail")
    private String detail;

    @Column(name = "TimeReport", nullable = false)
    private LocalDateTime timeReport;

    @Column(name = "ConfirmationStatus", nullable = false, length = 50)
    @Builder.Default
    private String confirmationStatus = "Pending_Review";

    @Column(name = "Confident")
    private Double confident;

    @Column(name = "DetectionLog", length = 255)
    private String detectionLog;

    @Lob
    @Column(name = "DetectPicture")
    private String detectPicture;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PoliceReviewer")
    private Police policeReviewer;

    @Column(name = "ReviewTime")
    private LocalDateTime reviewTime;

    @Lob
    @Column(name = "ReviewNotes")
    private String reviewNotes;

    @PrePersist
    protected void onCreate() {
        if (timeReport == null) timeReport = LocalDateTime.now();
        if (confirmationStatus == null) confirmationStatus = "Pending_Review";
    }
}