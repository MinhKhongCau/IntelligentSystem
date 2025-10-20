package com.intelligent.missingperson.entity;

import java.io.Serializable;
import java.util.Objects;

public class ManageDocumentId implements Serializable {
    private Long police;
    private Long missingDocument;
    
    public ManageDocumentId() {}
    
    public ManageDocumentId(Long police, Long missingDocument) {
        this.police = police;
        this.missingDocument = missingDocument;
    }
    
    public Long getPolice() {
        return police;
    }
    
    public void setPolice(Long police) {
        this.police = police;
    }
    
    public Long getMissingDocument() {
        return missingDocument;
    }
    
    public void setMissingDocument(Long missingDocument) {
        this.missingDocument = missingDocument;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ManageDocumentId that = (ManageDocumentId) o;
        return Objects.equals(police, that.police) && Objects.equals(missingDocument, that.missingDocument);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(police, missingDocument);
    }
}
