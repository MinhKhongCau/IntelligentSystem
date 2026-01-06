package com.intelligent.missingperson.repository;

import com.intelligent.missingperson.entity.CctvReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CctvReportRepository extends JpaRepository<CctvReport, Integer> {

    @Query("SELECT r FROM CctvReport r WHERE r.missingDocument.id = :missingId ORDER BY r.timeReport DESC")
    List<CctvReport> findByMissingDocumentId(Integer missingId);
}
