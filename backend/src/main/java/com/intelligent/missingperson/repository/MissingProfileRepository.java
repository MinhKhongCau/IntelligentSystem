package com.intelligent.missingperson.repository;

import com.intelligent.missingperson.entity.MissingProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MissingProfileRepository extends JpaRepository<MissingProfile, Long> {
    List<MissingProfile> findByStatus(String status);
    
    @Query("SELECT mp FROM MissingProfile mp WHERE mp.fullName LIKE %:name%")
    List<MissingProfile> findByFullNameContaining(@Param("name") String name);
    
    @Query("SELECT mp FROM MissingProfile mp WHERE mp.lastSeenArea.id = :areaId")
    List<MissingProfile> findByLastSeenAreaId(@Param("areaId") Long areaId);
    
    @Query("SELECT mp FROM MissingProfile mp WHERE mp.reporter.id = :reporterId")
    List<MissingProfile> findByReporterId(@Param("reporterId") Long reporterId);
}
