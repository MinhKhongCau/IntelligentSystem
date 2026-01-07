package com.intelligent.missingperson.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.intelligent.missingperson.entity.Volunteer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface VolunteerRepository extends JpaRepository<Volunteer, Integer>{
	Page<Volunteer> findAll(Pageable pageable);

	// Search volunteers by fields on the linked Account entity
	Page<Volunteer> findByAccountFullNameContainingIgnoreCaseOrAccountEmailContainingIgnoreCaseOrAccountPhoneContainingIgnoreCase(
			String fullName, String email, String phone, Pageable pageable);
}
