package com.intelligent.missingperson.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.intelligent.missingperson.entity.VolunteerReport;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface VolunteerReportRepository extends JpaRepository<VolunteerReport, Integer> {
    
    @Query("SELECT vr FROM VolunteerReport vr WHERE vr.missingDocument.id = :missingDocumentId ORDER BY vr.reportTime DESC")
    List<VolunteerReport> findByMissingDocumentId(@Param("missingDocumentId") Integer missingDocumentId);

    @Query("SELECT vr FROM VolunteerReport vr WHERE vr.volunteer.id = :volunteerId ORDER BY vr.reportTime DESC")
    Page<VolunteerReport> findByVolunteerId(@Param("volunteerId") Integer volunteerId, Pageable pageable);
}
