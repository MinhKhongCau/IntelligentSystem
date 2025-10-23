package com.intelligent.missingperson.entity;

import java.util.Date;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "CaseAssignment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@IdClass(CaseAssignmentId.class)
public class CaseAssignment {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Account", nullable = false)
    private Account account;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_MissingProfile", nullable = false)
    private MissingProfile missingProfile;

    @Column(name = "AssignmentDate", nullable = false)
    private Date assignmentDate;
}

