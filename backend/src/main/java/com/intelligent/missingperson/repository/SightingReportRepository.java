package com.intelligent.missingperson.repository;

import com.intelligent.missingperson.entity.SightingReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SightingReportRepository extends JpaRepository<SightingReport, Long> {
    List<SightingReport> findByVerificationStatus(String verificationStatus);
    
    @Query("SELECT sr FROM SightingReport sr WHERE sr.reporter.id = :reporterId")
    List<SightingReport> findByReporterId(@Param("reporterId") Long reporterId);
    
    @Query("SELECT sr FROM SightingReport sr WHERE sr.sightingArea.id = :areaId")
    List<SightingReport> findBySightingAreaId(@Param("areaId") Long areaId);
    
    @Query("SELECT sr FROM SightingReport sr WHERE sr.missingProfile.id = :missingProfileId")
    List<SightingReport> findByMissingProfileId(@Param("missingProfileId") Long missingProfileId);
}
