package com.intelligent.missingperson.entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"missingDocument","volunteer"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "VOLUNTEER_SUBSCRIPTION")
public class VolunteerSubscription implements Serializable {

    @EmbeddedId
    @EqualsAndHashCode.Include
    private VolunteerSubscriptionId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("missingDocumentId")
    @JoinColumn(name = "ID_MissingDocument", insertable = false, updatable = false)
    private MissingDocument missingDocument;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("volunteerId")
    @JoinColumn(name = "ID_Volunteer", insertable = false, updatable = false)
    private Volunteer volunteer;

    @Column(name = "SubscribedDate", nullable = false)
    private LocalDateTime subscribedDate;

    @Column(name = "IsActive", nullable = false)
    @Builder.Default
    private boolean isActive = true;

    @PrePersist
    protected void onCreate() {
        if (subscribedDate == null) subscribedDate = LocalDateTime.now();
    }
}