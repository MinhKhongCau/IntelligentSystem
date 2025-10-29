package com.intelligent.missingperson.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.intelligent.missingperson.entity.Volunteer;

@Repository
public interface VolunteerRepository extends JpaRepository<Volunteer, Integer>{
    
}
