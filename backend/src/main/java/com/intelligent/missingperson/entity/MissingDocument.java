package com.intelligent.missingperson.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "MISSING_DOCUMENT")
public class MissingDocument {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    @Column(name = "Name", nullable = false)
    private String name;
    
    @Column(name = "Birthday")
    private LocalDate birthday;
    
    @Column(name = "Gender")
    private Boolean gender; // 0: Male, 1: Female
    
    @Size(max = 100, message = "Identity card number must not exceed 100 characters")
    @Column(name = "IdentityCardNumber")
    private String identityCardNumber;
    
    @Size(max = 20, message = "Height must not exceed 20 characters")
    @Column(name = "Height")
    private String height;
    
    @Column(name = "IdentifyingCharacteristic", columnDefinition = "NTEXT")
    private String identifyingCharacteristic;
    
    @Column(name = "FacePictureUrl", columnDefinition = "VARCHAR(MAX)")
    private String facePictureUrl;
    
    @Column(name = "MissingTime")
    private LocalDateTime missingTime;
    
    @Column(name = "ReportDate")
    private LocalDateTime reportDate;
    
    @Column(name = "UpdateDate")
    private LocalDateTime updateDate;
    
    @Column(name = "Status", nullable = false)
    private Boolean status = false; // 0: Missing, 1: Found
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_MissingArea")
    private Area missingArea;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Reporter")
    private CarePartner reporter;
    
    // Constructors
    public MissingDocument() {}
    
    public MissingDocument(String name, LocalDate birthday, Boolean gender, String identityCardNumber, 
                          String height, String identifyingCharacteristic, String facePictureUrl, 
                          LocalDateTime missingTime, Area missingArea, CarePartner reporter) {
        this.name = name;
        this.birthday = birthday;
        this.gender = gender;
        this.identityCardNumber = identityCardNumber;
        this.height = height;
        this.identifyingCharacteristic = identifyingCharacteristic;
        this.facePictureUrl = facePictureUrl;
        this.missingTime = missingTime;
        this.missingArea = missingArea;
        this.reporter = reporter;
        this.reportDate = LocalDateTime.now();
        this.updateDate = LocalDateTime.now();
        this.status = false;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public LocalDateTime getReportDate() {
        return reportDate;
    }
    
    public void setReportDate(LocalDateTime reportDate) {
        this.reportDate = reportDate;
    }
    
    public LocalDateTime getUpdateDate() {
        return updateDate;
    }
    
    public void setUpdateDate(LocalDateTime updateDate) {
        this.updateDate = updateDate;
    }
    
    public Boolean getStatus() {
        return status;
    }
    
    public void setStatus(Boolean status) {
        this.status = status;
    }
    
    public Area getMissingArea() {
        return missingArea;
    }
    
    public void setMissingArea(Area missingArea) {
        this.missingArea = missingArea;
    }
    
    public CarePartner getReporter() {
        return reporter;
    }
    
    public void setReporter(CarePartner reporter) {
        this.reporter = reporter;
    }
}
