package com.intelligent.missingperson.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class VolunteerSubscriptionId implements Serializable {
    @Column(name = "id_missing_document")
    private Integer missingDocumentId;

    @Column(name = "id_volunteer")
    private Integer volunteerId;
}