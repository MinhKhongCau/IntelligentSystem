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
    @Column(name = "ID_MissingDocument")
    private Integer missingDocumentId;

    @Column(name = "ID_Volunteer")
    private Integer volunteerId;
}