package com.intelligent.missingperson.repository;

import com.intelligent.missingperson.entity.Reporter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarePartnerRepository extends JpaRepository<Reporter, Long> {
}
