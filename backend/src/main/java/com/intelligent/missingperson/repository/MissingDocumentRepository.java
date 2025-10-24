package com.intelligent.missingperson.repository;

import com.intelligent.missingperson.entity.MissingDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MissingDocumentRepository extends JpaRepository<MissingDocument, Integer> {
    
    @Query(value = "SELECT * FROM MISSING_DOCUMENT md WHERE md.FullName LIKE '%:name%'", nativeQuery = true)
    List<MissingDocument> findByNameContaining(@Param("name") String name);
    
    @Query(value = "SELECT * FROM MISSING_DOCUMENT AS md WHERE md.ID_MissingArea = :areaId", nativeQuery = true)
    List<MissingDocument> findByMissingAreaId(@Param("areaId") Integer areaId);
    
    @Query(value = "SELECT * FROM MISSING_DOCUMENT AS md WHERE md.ID_Reporter = :reporterId", nativeQuery = true)
    List<MissingDocument> findByReporterId(@Param("reporterId") Integer reporterId);

}
