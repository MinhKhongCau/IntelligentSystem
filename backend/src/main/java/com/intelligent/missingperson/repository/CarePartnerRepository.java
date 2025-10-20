package com.intelligent.missingperson.repository;

import com.intelligent.missingperson.entity.CarePartner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarePartnerRepository extends JpaRepository<CarePartner, Long> {
}
