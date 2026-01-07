package com.intelligent.missingperson.repository;

import com.intelligent.missingperson.entity.MissingDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface MissingDocumentRepository extends JpaRepository<MissingDocument, Integer> {
    
    List<MissingDocument> findByFullNameContaining(String name);
    Page<MissingDocument> findByFullNameContaining(String name, Pageable pageable);
    
    List<MissingDocument> findByMissingAreaId(@Param("areaId") Integer areaId);
    Page<MissingDocument> findByMissingAreaId(@Param("areaId") Integer areaId, Pageable pageable);
    
    List<MissingDocument> findByReporterId(@Param("reporterId") Integer reporterId);
    Page<MissingDocument> findByReporterId(@Param("reporterId") Integer reporterId, Pageable pageable);

    List<MissingDocument> findByCaseStatus(@Param("caseStatus") String caseStatus);

    @Query(value = "SELECT CAST(report_date AS DATE) as dt, COUNT(*) as cnt FROM MISSING_DOCUMENT GROUP BY CAST(report_date AS DATE) ORDER BY dt", nativeQuery = true)
    java.util.List<Object[]> countGroupedByReportDate();

}
