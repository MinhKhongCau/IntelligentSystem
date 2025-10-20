package com.intelligent.missingperson.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "INTEREST_PROFILE")
@IdClass(InterestProfileId.class)
public class InterestProfile {
    
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_MissingDocument", nullable = false)
    private MissingDocument missingDocument;
    
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Volunteer", nullable = false)
    private Volunteer volunteer;
    
    @Column(name = "InterestingDate")
    private LocalDateTime interestingDate;
    
    @Column(name = "FoundDate")
    private LocalDateTime foundDate;
    
    @Column(name = "FoundPicture", columnDefinition = "VARCHAR(MAX)")
    private String foundPicture;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "FoundArea")
    private Area foundArea;
    
    @Column(name = "Descripton", columnDefinition = "NVARCHAR(MAX)")
    private String description;
    
    // Constructors
    public InterestProfile() {}
    
    public InterestProfile(MissingDocument missingDocument, Volunteer volunteer, 
                          LocalDateTime interestingDate, Area foundArea, String description) {
        this.missingDocument = missingDocument;
        this.volunteer = volunteer;
        this.interestingDate = interestingDate;
        this.foundArea = foundArea;
        this.description = description;
    }
    
    // Getters and Setters
    public MissingDocument getMissingDocument() {
        return missingDocument;
    }
    
    public void setMissingDocument(MissingDocument missingDocument) {
        this.missingDocument = missingDocument;
    }
    
    public Volunteer getVolunteer() {
        return volunteer;
    }
    
    public void setVolunteer(Volunteer volunteer) {
        this.volunteer = volunteer;
    }
    
    public LocalDateTime getInterestingDate() {
        return interestingDate;
    }
    
    public void setInterestingDate(LocalDateTime interestingDate) {
        this.interestingDate = interestingDate;
    }
    
    public LocalDateTime getFoundDate() {
        return foundDate;
    }
    
    public void setFoundDate(LocalDateTime foundDate) {
        this.foundDate = foundDate;
    }
    
    public String getFoundPicture() {
        return foundPicture;
    }
    
    public void setFoundPicture(String foundPicture) {
        this.foundPicture = foundPicture;
    }
    
    public Area getFoundArea() {
        return foundArea;
    }
    
    public void setFoundArea(Area foundArea) {
        this.foundArea = foundArea;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
}
