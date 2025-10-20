package com.intelligent.missingperson.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "MANAGE_DOCUMENT")
@IdClass(ManageDocumentId.class)
public class ManageDocument {
    
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Police", nullable = false)
    private Police police;
    
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_MissingDocument", nullable = false)
    private MissingDocument missingDocument;
    
    @Column(name = "Descripton", columnDefinition = "NVARCHAR(MAX)")
    private String description;
    
    @Column(name = "FoundDate")
    private LocalDateTime foundDate;
    
    @Column(name = "FoundPersonPicture", columnDefinition = "VARCHAR(MAX)")
    private String foundPersonPicture;
    
    @Column(name = "ConfirmTime")
    private LocalDateTime confirmTime;
    
    @Column(name = "UpdateTime")
    private LocalDateTime updateTime;
    
    @Column(name = "Find_Place", columnDefinition = "NVARCHAR(MAX)")
    private String findPlace;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_FoundVolunteer")
    private Volunteer foundVolunteer;
    
    // Constructors
    public ManageDocument() {}
    
    public ManageDocument(Police police, MissingDocument missingDocument, String description, 
                         LocalDateTime foundDate, String foundPersonPicture, LocalDateTime confirmTime, 
                         String findPlace, Volunteer foundVolunteer) {
        this.police = police;
        this.missingDocument = missingDocument;
        this.description = description;
        this.foundDate = foundDate;
        this.foundPersonPicture = foundPersonPicture;
        this.confirmTime = confirmTime;
        this.findPlace = findPlace;
        this.foundVolunteer = foundVolunteer;
        this.updateTime = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Police getPolice() {
        return police;
    }
    
    public void setPolice(Police police) {
        this.police = police;
    }
    
    public MissingDocument getMissingDocument() {
        return missingDocument;
    }
    
    public void setMissingDocument(MissingDocument missingDocument) {
        this.missingDocument = missingDocument;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getFoundDate() {
        return foundDate;
    }
    
    public void setFoundDate(LocalDateTime foundDate) {
        this.foundDate = foundDate;
    }
    
    public String getFoundPersonPicture() {
        return foundPersonPicture;
    }
    
    public void setFoundPersonPicture(String foundPersonPicture) {
        this.foundPersonPicture = foundPersonPicture;
    }
    
    public LocalDateTime getConfirmTime() {
        return confirmTime;
    }
    
    public void setConfirmTime(LocalDateTime confirmTime) {
        this.confirmTime = confirmTime;
    }
    
    public LocalDateTime getUpdateTime() {
        return updateTime;
    }
    
    public void setUpdateTime(LocalDateTime updateTime) {
        this.updateTime = updateTime;
    }
    
    public String getFindPlace() {
        return findPlace;
    }
    
    public void setFindPlace(String findPlace) {
        this.findPlace = findPlace;
    }
    
    public Volunteer getFoundVolunteer() {
        return foundVolunteer;
    }
    
    public void setFoundVolunteer(Volunteer foundVolunteer) {
        this.foundVolunteer = foundVolunteer;
    }
}
