package com.intelligent.missingperson.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.intelligent.missingperson.entity.Police;

@Repository
public interface PoliceRepository extends JpaRepository<Police, Integer> {

    boolean existsById(Integer id);

    
}