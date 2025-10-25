package com.intelligent.missingperson.entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"police","missingDocument","foundVolunteer"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "MANAGE_DOCUMENT")
public class ManageDocument implements Serializable {

    @EmbeddedId
    @EqualsAndHashCode.Include
    private ManageDocumentId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("policeId")
    @JoinColumn(name = "id_police", insertable = false, updatable = false)
    private Police police;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("missingDocumentId")
    @JoinColumn(name = "id_missing_document", insertable = false, updatable = false)
    private MissingDocument missingDocument;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "foundDate")
    private LocalDateTime foundDate;

    @Lob
    @Column(name = "found_person_picture")
    private String foundPersonPicture;

    @Column(name = "confirm_time")
    private LocalDateTime confirmTime;

    @Column(name = "update_time")
    private LocalDateTime updateTime;

    @Lob
    @Column(name = "find_place")
    private String findPlace;

    @Column(name = "confirmation_method", length = 255)
    private String confirmationMethod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_found_volunteer")
    private Volunteer foundVolunteer;
}