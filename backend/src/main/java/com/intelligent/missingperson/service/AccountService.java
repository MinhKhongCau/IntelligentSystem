package com.intelligent.missingperson.service;

import com.intelligent.missingperson.entity.Account;
import com.intelligent.missingperson.repository.AccountRepository;
import com.intelligent.missingperson.until.Roles;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.sql.DataSource;

@Service
@RequiredArgsConstructor
// @Transactional
public class AccountService {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final DataSource dataSource;

    @Autowired 
    private CarePartnerService carePartnerService;

    @Autowired
    private PoliceService policeService;

    @Autowired 
    private VolunteerService volunteerService;

    public List<Account> findAll() {
        return accountRepository.findAll();
    }

    public Optional<Account> findById(Integer id) {
        return accountRepository.findById(id);
    }

    public Optional<Account> findByUsername(String username) {
        return accountRepository.findByUsername(username);
    }

    public Optional<Account> findByEmail(String email) {
        return accountRepository.findByEmail(email);
    }

    public boolean existsByUsername(String username) {
        return accountRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return accountRepository.existsByEmail(email);
    }

    public Account registerAccount(Account account) {
        // basic pre-checks (optional, procedure also checks)
        if (accountRepository.existsByUsername(account.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (accountRepository.existsByEmail(account.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        // encode password
        account.setPassword(passwordEncoder.encode(account.getPassword()));

        // set createdAt default if missing
        if (account.getCreatedAt() == null) account.setCreatedAt(LocalDateTime.now());
        if (account.getAccountType() == null) account.setAccountType("USER");

        System.out.println("---> Registering account via procedure: " + account);
        // call stored procedure
        SimpleJdbcCall call = new SimpleJdbcCall(dataSource)
                .withSchemaName("dbo")
                .withProcedureName("usp_RegisterAccount");

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("Username", account.getUsername())
                .addValue("Password", account.getPassword())
                .addValue("Email", account.getEmail())
                .addValue("FullName", account.getFullName())
                .addValue("Birthday", account.getBirthday() != null ? Date.valueOf(account.getBirthday()) : null)
                .addValue("Address", account.getAddress())
                .addValue("Gender", account.getGender())
                .addValue("Phone", account.getPhone())
                .addValue("ProfilePictureUrl", account.getProfilePictureUrl())
                .addValue("AccountType", account.getAccountType())
                .addValue("AccountStatus", account.isAccountStatus());

        Map<String, Object> out = call.execute(params);

        // procedure outputs
        Number statusNum = (Number) out.get("StatusCode");
        Number newIdNum = (Number) out.get("NewId");
        String message = out.get("Message") != null ? out.get("Message").toString() : null;

        int status = statusNum != null ? statusNum.intValue() : -1;

        System.out.println("---> Register procedure returned status=" + status + ", newId=" + newIdNum + ", message=" + message);
        if (status == 0) {
            Integer newId = newIdNum != null ? newIdNum.intValue() : null;
            if (newId == null) {
                throw new IllegalStateException("Procedure reported success but did not return new id");
            }
            Optional<Account> saved = accountRepository.findById(newId);
            return saved.orElseThrow(() -> new IllegalStateException("Account created but cannot be loaded, id=" + newId));
        } else if (status == 1 || status == 2) {
            throw new IllegalArgumentException(message != null ? message : "Duplicate username/email");
        } else {
            throw new IllegalStateException("Register procedure failed: " + (message != null ? message : "unknown error"));
        }
    }

    public Account save(Account account) {
        // Encode password if it's not already encoded
        if (account.getPassword() != null && !account.getPassword().startsWith("List<Roles>a$")) {
            account.setPassword(passwordEncoder.encode(account.getPassword()));
        }
        return accountRepository.save(account);
    }

    public void deleteById(Integer id) {
        accountRepository.deleteById(id);
    }

    public Account update(Account account) {
        Optional<Account> existingAccount = accountRepository.findById(account.getId());
        if (existingAccount.isEmpty()) {
            throw new RuntimeException("Account not found with id: " + account.getId());
        }

        // Only update password if a new one is provided
        if (account.getPassword() != null && !account.getPassword().startsWith("List<Roles>a$")) {
            account.setPassword(passwordEncoder.encode(account.getPassword()));
        } else {
            account.setPassword(existingAccount.get().getPassword());
        }

        return accountRepository.save(account);
    }

    public Account updateProfile(Integer id, Account updatedAccount) {
        return accountRepository.findById(id)
                .map(account -> {
                    account.setFullName(updatedAccount.getFullName());
                    account.setBirthday(updatedAccount.getBirthday());
                    account.setAddress(updatedAccount.getAddress());
                    account.setGender(updatedAccount.getGender());
                    account.setPhone(updatedAccount.getPhone());
                    account.setProfilePictureUrl(updatedAccount.getProfilePictureUrl());
                    return accountRepository.save(account);
                })
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));
    }

    public List<Roles> getRoles(Integer id) {
        List<Roles> roles = new ArrayList<>();
        // All accounts are users by default
        roles.add(Roles.USER);
        if (carePartnerService.findById(id).isPresent()) {
            roles.add(Roles.CARE_PARTNER);
        }
        if (policeService.findById(id).isPresent()) {
            roles.add(Roles.POLICE);
        }
        if (volunteerService.findById(id).isPresent()) {
            roles.add(Roles.VOLUNTEER);
        }
        return roles;
    }
}