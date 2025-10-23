package com.intelligent.missingperson.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "CCTV")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CCTV {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @NotBlank(message = "CCTV_Name is required")
    @Size(max = 255, message = "CCTV_Name must not exceed 255 characters")
    @Column(name = "CCTV_Name", nullable = false)
    private String cctvName;

    @Size(max = 50, message = "IP_Address must not exceed 50 characters")
    @Column(name = "IP_Address")
    private String ipAddress;

    @Column(name = "Port")
    private Integer port;

    @NotBlank(message = "Status is required")
    @Size(max = 50, message = "Status must not exceed 50 characters")
    @Column(name = "Status", nullable = false)
    private String status; // Active, Inactive, Maintenance

    @Column(name = "LocationDescription", columnDefinition = "TEXT")
    private String locationDescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Area", nullable = false)
    private Area area;
}

