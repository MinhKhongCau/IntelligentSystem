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
    @Column(name = "id")
    private Integer id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private Account account;

    @Column(name = "partner_status", nullable = false)
    @Builder.Default
    private boolean partnerStatus = true;

    @Column(name = "partner_type", length = 100)
    private String partnerType;

    @Column(name = "organization_name", length = 255)
    private String organizationName;
}