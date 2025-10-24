package com.intelligent.missingperson.service;

import com.intelligent.missingperson.entity.Account;
import com.intelligent.missingperson.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AccountService {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

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

    public Account save(Account account) {
        // Encode password if it's not already encoded
        if (account.getPassword() != null && !account.getPassword().startsWith("$2a$")) {
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
        if (account.getPassword() != null && !account.getPassword().startsWith("$2a$")) {
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
}