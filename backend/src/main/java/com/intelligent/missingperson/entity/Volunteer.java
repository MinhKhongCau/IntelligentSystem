package com.intelligent.missingperson.entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "account")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "VOLUNTEER")
public class Volunteer implements Serializable {

    @Id
    @Column(name = "ID")
    @EqualsAndHashCode.Include
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "ID")
    private Account account;

    @Column(name = "VolunteerStatus", nullable = false)
    @Builder.Default
    private boolean volunteerStatus = true;

    @Column(name = "DateJoined")
    private LocalDate dateJoined;

    @Lob
    @Column(name = "Skills")
    private String skills;

    @Column(name = "Rating")
    @Builder.Default
    private Double rating = 3.0;
}