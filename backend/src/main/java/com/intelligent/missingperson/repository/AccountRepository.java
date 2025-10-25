package com.intelligent.missingperson.repository;

import com.intelligent.missingperson.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    Optional<Account> findByUsername(@Param("username") String username);
    Optional<Account> findByEmail(@Param("email") String email);
    boolean existsByUsername(@Param("username") String username);
    boolean existsByEmail(@Param("email") String email);
}
