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
    @JoinColumn(name = "ID_Police", insertable = false, updatable = false)
    private Police police;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("missingDocumentId")
    @JoinColumn(name = "ID_MissingDocument", insertable = false, updatable = false)
    private MissingDocument missingDocument;

    @Lob
    @Column(name = "Description")
    private String description;

    @Column(name = "FoundDate")
    private LocalDateTime foundDate;

    @Lob
    @Column(name = "FoundPersonPicture")
    private String foundPersonPicture;

    @Column(name = "ConfirmTime")
    private LocalDateTime confirmTime;

    @Column(name = "UpdateTime")
    private LocalDateTime updateTime;

    @Lob
    @Column(name = "Find_Place")
    private String findPlace;

    @Column(name = "ConfirmationMethod", length = 255)
    private String confirmationMethod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_FoundVolunteer")
    private Volunteer foundVolunteer;
}