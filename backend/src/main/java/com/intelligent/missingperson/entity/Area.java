package com.intelligent.missingperson.entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"cctvs","detailAreaAccounts","missingDocuments","volunteerReports"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "AREA")
public class Area implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    @EqualsAndHashCode.Include
    private Integer id;

    @Column(name = "Commune", length = 100)
    private String commune;

    @Column(name = "District", length = 100)
    private String district;

    @Column(name = "Province", nullable = false, length = 100)
    private String province;

    @Column(name = "Country", nullable = false, length = 100)
    private String country;

    @Column(name = "Latitude", precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(name = "Longitude", precision = 9, scale = 6)
    private BigDecimal longitude;

    @Column(name = "Description", length = 500)
    private String description;

    @OneToMany(mappedBy = "area", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Cctv> cctvs = new HashSet<>();

    @OneToMany(mappedBy = "area", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<DetailAreaAccount> detailAreaAccounts = new HashSet<>();

    @OneToMany(mappedBy = "missingArea", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<MissingDocument> missingDocuments = new HashSet<>();

    @OneToMany(mappedBy = "sightingArea", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<VolunteerReport> volunteerReports = new HashSet<>();
}