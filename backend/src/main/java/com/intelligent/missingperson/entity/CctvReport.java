package com.intelligent.missingperson.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "CCTV_REPORT")
@IdClass(CctvReportId.class)
public class CctvReport {
    
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CCTV", nullable = false)
    private Cctv cctv;
    
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_MissingDocument", nullable = false)
    private MissingDocument missingDocument;
    
    @Id
    @Column(name = "TimeReport", nullable = false)
    private LocalDateTime timeReport;
    
    @Column(name = "Detail", columnDefinition = "NVARCHAR(MAX)")
    private String detail;
    
    @Column(name = "Status")
    private Boolean status;
    
    @Column(name = "Confident")
    private Float confident;
    
    @Size(max = 255, message = "Detection log must not exceed 255 characters")
    @Column(name = "DetectionLog")
    private String detectionLog;
    
    @Column(name = "DetectPicture", columnDefinition = "VARCHAR(MAX)")
    private String detectPicture;
    
    // Constructors
    public CctvReport() {}
    
    public CctvReport(Cctv cctv, MissingDocument missingDocument, LocalDateTime timeReport, 
                     String detail, Boolean status, Float confident, String detectionLog, String detectPicture) {
        this.cctv = cctv;
        this.missingDocument = missingDocument;
        this.timeReport = timeReport;
        this.detail = detail;
        this.status = status;
        this.confident = confident;
        this.detectionLog = detectionLog;
        this.detectPicture = detectPicture;
    }
    
    // Getters and Setters
    public Cctv getCctv() {
        return cctv;
    }
    
    public void setCctv(Cctv cctv) {
        this.cctv = cctv;
    }
    
    public MissingDocument getMissingDocument() {
        return missingDocument;
    }
    
    public void setMissingDocument(MissingDocument missingDocument) {
        this.missingDocument = missingDocument;
    }
    
    public LocalDateTime getTimeReport() {
        return timeReport;
    }
    
    public void setTimeReport(LocalDateTime timeReport) {
        this.timeReport = timeReport;
    }
    
    public String getDetail() {
        return detail;
    }
    
    public void setDetail(String detail) {
        this.detail = detail;
    }
    
    public Boolean getStatus() {
        return status;
    }
    
    public void setStatus(Boolean status) {
        this.status = status;
    }
    
    public Float getConfident() {
        return confident;
    }
    
    public void setConfident(Float confident) {
        this.confident = confident;
    }
    
    public String getDetectionLog() {
        return detectionLog;
    }
    
    public void setDetectionLog(String detectionLog) {
        this.detectionLog = detectionLog;
    }
    
    public String getDetectPicture() {
        return detectPicture;
    }
    
    public void setDetectPicture(String detectPicture) {
        this.detectPicture = detectPicture;
    }
}
