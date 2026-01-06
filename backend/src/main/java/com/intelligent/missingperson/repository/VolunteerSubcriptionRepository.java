package com.intelligent.missingperson.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.intelligent.missingperson.entity.VolunteerSubscription;
import com.intelligent.missingperson.entity.VolunteerSubscriptionId;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

@Repository
public interface VolunteerSubcriptionRepository extends JpaRepository<VolunteerSubscription, VolunteerSubscriptionId>{
    
    @Query("SELECT vs FROM VolunteerSubscription vs WHERE vs.id.volunteerId = :volunteerId AND vs.isActive = true")
    List<VolunteerSubscription> findByVolunteerIdAndIsActiveTrue(@Param("volunteerId") Integer volunteerId);

    @Query("SELECT vs FROM VolunteerSubscription vs WHERE vs.id.volunteerId = :volunteerId AND vs.isActive = true")
    Page<VolunteerSubscription> findByVolunteerIdAndIsActiveTrue(@Param("volunteerId") Integer volunteerId, Pageable pageable);
    
    @Query("SELECT vs FROM VolunteerSubscription vs WHERE vs.id.missingDocumentId = :missingDocumentId AND vs.id.volunteerId = :volunteerId AND vs.isActive = true")
    Optional<VolunteerSubscription> findByMissingDocumentIdAndVolunteerIdAndIsActiveTrue(
        @Param("missingDocumentId") Integer missingDocumentId, 
        @Param("volunteerId") Integer volunteerId
    );
} 
