package com.intelligent.missingperson.repository;

import com.intelligent.missingperson.entity.MissingDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MissingDocumentRepository extends JpaRepository<MissingDocument, Integer> {
    
    List<MissingDocument> findByFullNameContaining(String name);
    
    List<MissingDocument> findByMissingAreaId(@Param("areaId") Integer areaId);
    
    List<MissingDocument> findByReporterId(@Param("reporterId") Integer reporterId);

    List<MissingDocument> findByCaseStatus(@Param("caseStatus") String caseStatus);

}
