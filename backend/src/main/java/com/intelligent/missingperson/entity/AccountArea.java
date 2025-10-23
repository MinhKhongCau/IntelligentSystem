package com.intelligent.missingperson.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Account_Area")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@IdClass(AccountAreaId.class)
public class AccountArea {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Account", nullable = false)
    private Account account;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Area", nullable = false)
    private Area area;
}

