package com.intelligent.missingperson.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class ManageDocumentId implements Serializable {
    @Column(name = "id_police")
    private Integer policeId;

    @Column(name = "id_missing_document")
    private Integer missingDocumentId;
}