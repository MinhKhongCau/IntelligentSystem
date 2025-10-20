package com.intelligent.missingperson.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

@Entity
@Table(name = "VOLUNTEER")
public class Volunteer {
    
    @Id
    @Column(name = "ID")
    private Long id;
    
    @Column(name = "VolunteerStatus")
    private Boolean volunteerStatus;
    
    @Column(name = "DateJoined")
    private LocalDate dateJoined;
    
    @Size(max = 255, message = "Skill must not exceed 255 characters")
    @Column(name = "SKILL")
    private String skill;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID")
    @MapsId
    private Account account;
    
    // Constructors
    public Volunteer() {}
    
    public Volunteer(Boolean volunteerStatus, LocalDate dateJoined, String skill) {
        this.volunteerStatus = volunteerStatus;
        this.dateJoined = dateJoined;
        this.skill = skill;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Boolean getVolunteerStatus() {
        return volunteerStatus;
    }
    
    public void setVolunteerStatus(Boolean volunteerStatus) {
        this.volunteerStatus = volunteerStatus;
    }
    
    public LocalDate getDateJoined() {
        return dateJoined;
    }
    
    public void setDateJoined(LocalDate dateJoined) {
        this.dateJoined = dateJoined;
    }
    
    public String getSkill() {
        return skill;
    }
    
    public void setSkill(String skill) {
        this.skill = skill;
    }
    
    public Account getAccount() {
        return account;
    }
    
    public void setAccount(Account account) {
        this.account = account;
    }
}
