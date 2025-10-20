package com.intelligent.missingperson.entity;

import java.io.Serializable;
import java.util.Objects;

public class InterestProfileId implements Serializable {
    private Long missingDocument;
    private Long volunteer;
    
    public InterestProfileId() {}
    
    public InterestProfileId(Long missingDocument, Long volunteer) {
        this.missingDocument = missingDocument;
        this.volunteer = volunteer;
    }
    
    public Long getMissingDocument() {
        return missingDocument;
    }
    
    public void setMissingDocument(Long missingDocument) {
        this.missingDocument = missingDocument;
    }
    
    public Long getVolunteer() {
        return volunteer;
    }
    
    public void setVolunteer(Long volunteer) {
        this.volunteer = volunteer;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        InterestProfileId that = (InterestProfileId) o;
        return Objects.equals(missingDocument, that.missingDocument) && Objects.equals(volunteer, that.volunteer);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(missingDocument, volunteer);
    }
}
