package com.intelligent.missingperson.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.intelligent.missingperson.entity.VolunteerReport;

@Repository
public interface VolunteerReportRepository extends JpaRepository<VolunteerReport, Integer> {
    
}
