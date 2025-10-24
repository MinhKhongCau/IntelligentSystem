package com.intelligent.missingperson.entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "area")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "CCTV")
public class Cctv implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    @EqualsAndHashCode.Include
    private Integer id;

    @Column(name = "Name", length = 255)
    private String name;

    @Column(name = "Status", length = 50)
    private String status;

    @Lob
    @Column(name = "StreamUrl", nullable = false)
    private String streamUrl;

    @Column(name = "IP", length = 50)
    private String ip;

    @Column(name = "Port")
    private Integer port;

    @Column(name = "Latitude", precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(name = "Longitude", precision = 9, scale = 6)
    private BigDecimal longitude;

    @Column(name = "CameraType", length = 100)
    private String cameraType;

    @Column(name = "LastOnline")
    private LocalDateTime lastOnline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Area")
    private Area area;
}