package com.intelligent.missingperson.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "POLICE")
public class Police {
    
    @Id
    @Column(name = "ID")
    private Long id;
    
    @Size(max = 255, message = "Patrol car number must not exceed 255 characters")
    @Column(name = "Patrol_Car_number", unique = true)
    private String patrolCarNumber;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID")
    @MapsId
    private Account account;
    
    // Constructors
    public Police() {}
    
    public Police(String patrolCarNumber) {
        this.patrolCarNumber = patrolCarNumber;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getPatrolCarNumber() {
        return patrolCarNumber;
    }
    
    public void setPatrolCarNumber(String patrolCarNumber) {
        this.patrolCarNumber = patrolCarNumber;
    }
    
    public Account getAccount() {
        return account;
    }
    
    public void setAccount(Account account) {
        this.account = account;
    }
}
