package com.intelligent.missingperson.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class MissingDocumentRequest {
    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String name;

    private LocalDate birthday;
    private Boolean gender;
    
    @Size(max = 100, message = "Identity card number must not exceed 100 characters")
    private String identityCardNumber;
    
    @Size(max = 20, message = "Height must not exceed 20 characters")
    private String height;
    
    private String identifyingCharacteristic;
    private String facePictureUrl;
    private LocalDateTime missingTime;
    private Long missingAreaId;
    private Long reporterId;

    public MissingDocumentRequest() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getBirthday() {
        return birthday;
    }

    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
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

    public String getIdentifyingCharacteristic() {
        return identifyingCharacteristic;
    }

    public void setIdentifyingCharacteristic(String identifyingCharacteristic) {
        this.identifyingCharacteristic = identifyingCharacteristic;
    }

    public String getFacePictureUrl() {
        return facePictureUrl;
    }

    public void setFacePictureUrl(String facePictureUrl) {
        this.facePictureUrl = facePictureUrl;
    }

    public LocalDateTime getMissingTime() {
        return missingTime;
    }

    public void setMissingTime(LocalDateTime missingTime) {
        this.missingTime = missingTime;
    }

    public Long getMissingAreaId() {
        return missingAreaId;
    }

    public void setMissingAreaId(Long missingAreaId) {
        this.missingAreaId = missingAreaId;
    }

    public Long getReporterId() {
        return reporterId;
    }

    public void setReporterId(Long reporterId) {
        this.reporterId = reporterId;
    }
}
