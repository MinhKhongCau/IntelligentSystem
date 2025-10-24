package com.intelligent.missingperson.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "account")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "CARE_PARTNER")
public class CarePartner implements Serializable {

    @Id
    @EqualsAndHashCode.Include
    @Column(name = "ID")
    private Integer id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "ID")
    private Account account;

    @Column(name = "PartnerStatus", nullable = false)
    @Builder.Default
    private boolean partnerStatus = true;

    @Column(name = "PartnerType", length = 100)
    private String partnerType;

    @Column(name = "OrganizationName", length = 255)
    private String organizationName;
}