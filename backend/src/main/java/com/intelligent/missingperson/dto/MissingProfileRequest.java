package com.intelligent.missingperson.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Date;

public class MissingProfileRequest {
    @NotBlank(message = "FullName is required")
    @Size(max = 255, message = "FullName must not exceed 255 characters")
    private String fullName;

    private Date birthdate;
    private Boolean gender; // 0 = Female, 1 = Male
    
    @Size(max = 20, message = "Identity card number must not exceed 20 characters")
    private String identityCardNumber;
    
    @Size(max = 20, message = "Height must not exceed 20 characters")
    private String height;
    
    private String identifyingFeatures;
    
    @NotBlank(message = "ReferenceFaceImageURL is required")
    private String referenceFaceImageURL;
    
    private Date missingTimestamp;
    
    @NotBlank(message = "Status is required")
    @Size(max = 50, message = "Status must not exceed 50 characters")
    private String status; // Missing, Found, Suspended
    
    private Long reporterId;
    private Long lastSeenAreaId;

    public MissingProfileRequest() {}

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Date getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(Date birthdate) {
        this.birthdate = birthdate;
    }

    public Boolean getGender() {
        return gender;
    }

    public void setGender(Boolean gender) {
        this.gender = gender;
    }

    public String getIdentityCardNumber() {
        return identityCardNumber;
    }

    public void setIdentityCardNumber(String identityCardNumber) {
        this.identityCardNumber = identityCardNumber;
    }

    public String getHeight() {
        return height;
    }

    public void setHeight(String height) {
        this.height = height;
    }

    public String getIdentifyingFeatures() {
        return identifyingFeatures;
    }

    public void setIdentifyingFeatures(String identifyingFeatures) {
        this.identifyingFeatures = identifyingFeatures;
    }

    public String getReferenceFaceImageURL() {
        return referenceFaceImageURL;
    }

    public void setReferenceFaceImageURL(String referenceFaceImageURL) {
        this.referenceFaceImageURL = referenceFaceImageURL;
    }

    public Date getMissingTimestamp() {
        return missingTimestamp;
    }

    public void setMissingTimestamp(Date missingTimestamp) {
        this.missingTimestamp = missingTimestamp;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getReporterId() {
        return reporterId;
    }

    public void setReporterId(Long reporterId) {
        this.reporterId = reporterId;
    }

    public Long getLastSeenAreaId() {
        return lastSeenAreaId;
    }

    public void setLastSeenAreaId(Long lastSeenAreaId) {
        this.lastSeenAreaId = lastSeenAreaId;
    }
}
