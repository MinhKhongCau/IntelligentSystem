package com.intelligent.missingperson.repository;

import com.intelligent.missingperson.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    Optional<Account> findByUsername(@Param("username") String username);
    Optional<Account> findByEmail(@Param("email") String email);
    boolean existsByUsername(@Param("username") String username);
    boolean existsByEmail(@Param("email") String email);

    Page<Account> findAll(Pageable pageable);

        Page<Account> findByFullNameContainingIgnoreCaseOrUsernameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(
            String fullName, String username, String email, String phone, Pageable pageable);

        // Return rows as [date, count] where date is the created date (DATE part)
        @Query(value = "SELECT CAST(created_at AS DATE) as dt, COUNT(*) as cnt FROM ACCOUNT GROUP BY CAST(created_at AS DATE) ORDER BY dt", nativeQuery = true)
        java.util.List<Object[]> countGroupedByCreatedDate();
}
