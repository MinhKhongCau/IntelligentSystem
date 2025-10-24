package com.intelligent.missingperson.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"account","area"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "DETAIL_AREA_ACCOUNT")
public class DetailAreaAccount implements Serializable {

    @EmbeddedId
    @EqualsAndHashCode.Include
    private DetailAreaAccountId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("accountId")
    @JoinColumn(name = "ID_Account", insertable = false, updatable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("areaId")
    @JoinColumn(name = "ID_Area", insertable = false, updatable = false)
    private Area area;
}