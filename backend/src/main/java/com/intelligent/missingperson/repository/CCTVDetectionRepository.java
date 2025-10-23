package com.intelligent.missingperson.repository;

import com.intelligent.missingperson.entity.CCTVDetection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CCTVDetectionRepository extends JpaRepository<CCTVDetection, Long> {
    List<CCTVDetection> findByVerificationStatus(String verificationStatus);
    
    @Query("SELECT cd FROM CCTVDetection cd WHERE cd.cctv.id = :cctvId")
    List<CCTVDetection> findByCCTVId(@Param("cctvId") Long cctvId);
    
    @Query("SELECT cd FROM CCTVDetection cd WHERE cd.missingProfile.id = :missingProfileId")
    List<CCTVDetection> findByMissingProfileId(@Param("missingProfileId") Long missingProfileId);
}
