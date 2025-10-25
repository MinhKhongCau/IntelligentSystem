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
    @Column(name = "id")
    @EqualsAndHashCode.Include
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    private Account account;

    @Column(name = "volunteer_status", nullable = false)
    @Builder.Default
    private boolean volunteerStatus = true;

    @Column(name = "date_joined")
    private LocalDate dateJoined;

    @Lob
    @Column(name = "skills")
    private String skills;

    @Column(name = "rating")
    @Builder.Default
    private Double rating = 3.0;
}