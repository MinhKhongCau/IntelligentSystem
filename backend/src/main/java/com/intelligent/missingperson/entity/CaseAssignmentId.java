package com.intelligent.missingperson.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CaseAssignmentId implements Serializable {

    private Long account;
    private Long missingProfile;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CaseAssignmentId that = (CaseAssignmentId) o;
        return Objects.equals(account, that.account) &&
               Objects.equals(missingProfile, that.missingProfile);
    }

    @Override
    public int hashCode() {
        return Objects.hash(account, missingProfile);
    }
}

