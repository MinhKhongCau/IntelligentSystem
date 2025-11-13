package com.intelligent.missingperson.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.intelligent.missingperson.entity.VolunteerReport;

import java.util.List;

@Repository
public interface VolunteerReportRepository extends JpaRepository<VolunteerReport, Integer> {
    
    @Query("SELECT vr FROM VolunteerReport vr WHERE vr.missingDocument.id = :missingDocumentId ORDER BY vr.reportTime DESC")
    List<VolunteerReport> findByMissingDocumentId(@Param("missingDocumentId") Integer missingDocumentId);
}
