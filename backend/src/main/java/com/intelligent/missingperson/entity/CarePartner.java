package com.intelligent.missingperson.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "CARE_PARTNER")
public class CarePartner {
    
    @Id
    @Column(name = "ID")
    private Long id;
    
    @Column(name = "PARNER_Status")
    private Boolean partnerStatus;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID")
    @MapsId
    private Account account;
    
    // Constructors
    public CarePartner() {}
    
    public CarePartner(Boolean partnerStatus) {
        this.partnerStatus = partnerStatus;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Boolean getPartnerStatus() {
        return partnerStatus;
    }
    
    public void setPartnerStatus(Boolean partnerStatus) {
        this.partnerStatus = partnerStatus;
    }
    
    public Account getAccount() {
        return account;
    }
    
    public void setAccount(Account account) {
        this.account = account;
    }
}
