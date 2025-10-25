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
    @Column(name = "id")
    @EqualsAndHashCode.Include
    private Integer id;

    @Column(name = "name", length = 255)
    private String name;

    @Column(name = "status", length = 50)
    private String status;

    @Lob
    @Column(name = "stream_url", nullable = false)
    private String streamUrl;

    @Column(name = "ip", length = 50)
    private String ip;

    @Column(name = "port")
    private Integer port;

    @Column(name = "latitude", precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 9, scale = 6)
    private BigDecimal longitude;

    @Column(name = "camera_type", length = 100)
    private String cameraType;

    @Column(name = "last_online")
    private LocalDateTime lastOnline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_area")
    private Area area;
}