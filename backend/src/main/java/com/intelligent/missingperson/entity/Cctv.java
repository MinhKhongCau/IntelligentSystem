package com.intelligent.missingperson.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "CCTV")
public class Cctv {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @Size(max = 255, message = "Name must not exceed 255 characters")
    @Column(name = "Name")
    private String name;
    
    @Size(max = 50, message = "Status must not exceed 50 characters")
    @Column(name = "Status")
    private String status;
    
    @Size(max = 50, message = "IP must not exceed 50 characters")
    @Column(name = "IP")
    private String ip;
    
    @Column(name = "Port")
    private Integer port;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Area")
    private Area area;
    
    // Constructors
    public Cctv() {}
    
    public Cctv(String name, String status, String ip, Integer port, Area area) {
        this.name = name;
        this.status = status;
        this.ip = ip;
        this.port = port;
        this.area = area;
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
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getIp() {
        return ip;
    }
    
    public void setIp(String ip) {
        this.ip = ip;
    }
    
    public Integer getPort() {
        return port;
    }
    
    public void setPort(Integer port) {
        this.port = port;
    }
    
    public Area getArea() {
        return area;
    }
    
    public void setArea(Area area) {
        this.area = area;
    }
}
