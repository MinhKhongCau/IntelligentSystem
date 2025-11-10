package com.intelligent.missingperson.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.intelligent.missingperson.entity.VolunteerSubscription;

@Repository
public interface VolunteerSubcriptionRepository extends JpaRepository<VolunteerSubscription, Integer>{
    
} 
