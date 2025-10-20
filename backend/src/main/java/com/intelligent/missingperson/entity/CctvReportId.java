package com.intelligent.missingperson.entity;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

public class CctvReportId implements Serializable {
    private Long cctv;
    private Long missingDocument;
    private LocalDateTime timeReport;
    
    public CctvReportId() {}
    
    public CctvReportId(Long cctv, Long missingDocument, LocalDateTime timeReport) {
        this.cctv = cctv;
        this.missingDocument = missingDocument;
        this.timeReport = timeReport;
    }
    
    public Long getCctv() {
        return cctv;
    }
    
    public void setCctv(Long cctv) {
        this.cctv = cctv;
    }
    
    public Long getMissingDocument() {
        return missingDocument;
    }
    
    public void setMissingDocument(Long missingDocument) {
        this.missingDocument = missingDocument;
    }
    
    public LocalDateTime getTimeReport() {
        return timeReport;
    }
    
    public void setTimeReport(LocalDateTime timeReport) {
        this.timeReport = timeReport;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CctvReportId that = (CctvReportId) o;
        return Objects.equals(cctv, that.cctv) && 
               Objects.equals(missingDocument, that.missingDocument) && 
               Objects.equals(timeReport, that.timeReport);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(cctv, missingDocument, timeReport);
    }
}
