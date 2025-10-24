package com.intelligent.missingperson.entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "account")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "POLICE", uniqueConstraints = {
        @UniqueConstraint(columnNames = "PoliceCode"),
        @UniqueConstraint(columnNames = "Patrol_Car_number")
})
public class Police implements Serializable {

    @Id
    @Column(name = "ID")
    @EqualsAndHashCode.Include
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "ID")
    private Account account;

    @Column(name = "PoliceCode", length = 50)
    private String policeCode;

    @Column(name = "Rank", length = 100)
    private String rank;

    @Column(name = "Station", length = 255)
    private String station;

    @Column(name = "Patrol_Car_number", length = 255)
    private String patrolCarNumber;
}