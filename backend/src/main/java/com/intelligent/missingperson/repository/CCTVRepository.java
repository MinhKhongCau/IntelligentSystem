package com.intelligent.missingperson.repository;

import com.intelligent.missingperson.entity.CCTV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CCTVRepository extends JpaRepository<CCTV, Long> {
    List<CCTV> findByStatus(String status);
    
    @Query("SELECT c FROM CCTV c WHERE c.area.id = :areaId")
    List<CCTV> findByAreaId(@Param("areaId") Long areaId);
}
