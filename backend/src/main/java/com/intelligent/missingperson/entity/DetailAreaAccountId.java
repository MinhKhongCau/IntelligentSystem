package com.intelligent.missingperson.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class DetailAreaAccountId implements Serializable {
    @Column(name = "id_area")
    private Integer areaId;

    @Column(name = "id_account")
    private Integer accountId;
}