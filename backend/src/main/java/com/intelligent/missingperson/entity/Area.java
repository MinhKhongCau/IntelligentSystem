package com.intelligent.missingperson.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "AREA")
public class Area {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @NotBlank(message = "Commune is required")
    @Size(max = 100, message = "Commune must not exceed 100 characters")
    @Column(name = "Commune", nullable = false)
    private String commune;
    
    @Size(max = 100, message = "Province must not exceed 100 characters")
    @Column(name = "Province")
    private String province;
    
    @Size(max = 100, message = "Country must not exceed 100 characters")
    @Column(name = "Country")
    private String country;
    
    // Constructors
    public Area() {}
    
    public Area(String commune, String province, String country) {
        this.commune = commune;
        this.province = province;
        this.country = country;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getCommune() {
        return commune;
    }
    
    public void setCommune(String commune) {
        this.commune = commune;
    }
    
    public String getProvince() {
        return province;
    }
    
    public void setProvince(String province) {
        this.province = province;
    }
    
    public String getCountry() {
        return country;
    }
    
    public void setCountry(String country) {
        this.country = country;
    }
}
