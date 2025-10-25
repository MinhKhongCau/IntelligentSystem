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
    @Column(name = "id")
    @EqualsAndHashCode.Include
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    private Account account;

    @Column(name = "police_code", length = 50)
    private String policeCode;

    @Column(name = "rank", length = 100)
    private String rank;

    @Column(name = "station", length = 255)
    private String station;

    @Column(name = "patrol_car_number", length = 255)
    private String patrolCarNumber;
}