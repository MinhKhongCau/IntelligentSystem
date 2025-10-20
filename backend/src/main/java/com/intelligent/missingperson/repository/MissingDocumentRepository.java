package com.intelligent.missingperson.repository;

import com.intelligent.missingperson.entity.MissingDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MissingDocumentRepository extends JpaRepository<MissingDocument, Long> {
    List<MissingDocument> findByStatus(Boolean status);
    
    @Query("SELECT md FROM MissingDocument md WHERE md.name LIKE %:name%")
    List<MissingDocument> findByNameContaining(@Param("name") String name);
    
    @Query("SELECT md FROM MissingDocument md WHERE md.missingArea.id = :areaId")
    List<MissingDocument> findByMissingAreaId(@Param("areaId") Long areaId);
    
    @Query("SELECT md FROM MissingDocument md WHERE md.reporter.id = :reporterId")
    List<MissingDocument> findByReporterId(@Param("reporterId") Long reporterId);
}
