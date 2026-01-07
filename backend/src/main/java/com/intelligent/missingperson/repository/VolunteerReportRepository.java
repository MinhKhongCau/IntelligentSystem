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

    @Query("SELECT vr FROM VolunteerReport vr WHERE vr.volunteer.id = :volunteerId AND vr.reportStatus = :status ORDER BY vr.reportTime DESC")
    Page<VolunteerReport> findByVolunteerIdAndReportStatus(@Param("volunteerId") Integer volunteerId, @Param("status") String status, Pageable pageable);

    @Query("SELECT vr FROM VolunteerReport vr WHERE vr.volunteer.id = :volunteerId AND LOWER(vr.missingDocument.fullName) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY vr.reportTime DESC")
    Page<VolunteerReport> findByVolunteerIdAndMissingDocumentFullNameContaining(@Param("volunteerId") Integer volunteerId, @Param("name") String name, Pageable pageable);

    @Query(value = "SELECT CAST(report_time AS DATE) as dt, COUNT(*) as cnt FROM VOLUNTEER_REPORT GROUP BY CAST(report_time AS DATE) ORDER BY dt", nativeQuery = true)
    java.util.List<Object[]> countGroupedByReportDate();
}
