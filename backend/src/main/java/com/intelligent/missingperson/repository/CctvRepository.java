package com.intelligent.missingperson.repository;

import com.intelligent.missingperson.entity.Cctv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

@Repository
public interface CctvRepository extends JpaRepository<Cctv, Integer> {
    
    Optional<Cctv> findByIp(String ip);
    
    List<Cctv> findByStatus(String status);
    
    @Query("SELECT c FROM Cctv c WHERE c.area.id = :areaId")
    List<Cctv> findByAreaId(Integer areaId);

    Page<Cctv> findByNameContaining(String name, Pageable pageable);

    Page<Cctv> findByIpContaining(String ip, Pageable pageable);
    
    @Query("SELECT c FROM Cctv c WHERE c.status = 'Active' OR c.status = 'Online'")
    List<Cctv> findAllActiveCameras();
}
