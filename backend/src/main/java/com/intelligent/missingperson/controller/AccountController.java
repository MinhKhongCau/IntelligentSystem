package com.intelligent.missingperson.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.intelligent.missingperson.dto.AccountDTO;
import com.intelligent.missingperson.entity.Account;
import com.intelligent.missingperson.service.AccountService;
import com.intelligent.missingperson.service.PoliceService;

@RestController
@RequestMapping("/api/accounts")   
@CrossOrigin(origins = "*")
public class AccountController {
    @Autowired
    private AccountService accountService;


    @Autowired
    private PoliceService policeService;

    @GetMapping
    public ResponseEntity<?> getAccountsPage(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String name
        ) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Authentication required");
        }
        
        String username = authentication.getName();
        Optional<Account> optAccount = accountService.findByUsername(username);
        if (optAccount.isPresent() && policeService.existsById(optAccount.get().getId())) {
            List<Account> accounts = accountService.findAll();
            List<AccountDTO> accountDTOs = accounts.stream().map(account -> {
                return AccountDTO.builder()
                        .id(account.getId())
                        .username(account.getUsername())
                        .email(account.getEmail())
                        .fullName(account.getFullName())
                        .birthday(account.getBirthday())
                        .address(account.getAddress())
                        .gender(account.getGender())
                        .phone(account.getPhone())
                        .profilePictureUrl(account.getProfilePictureUrl())
                        .accountType(account.getAccountType())
                        .build();
            }).toList();
            return ResponseEntity.ok(accountDTOs);
        }
        return ResponseEntity.status(403).body("Access denied");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(
        Authentication authentication,
        @PathVariable Integer id) {
        String currentPrincipalName = authentication.getName();
        Optional<Account> optAccount = accountService.findByUsername(currentPrincipalName);
        if (optAccount.isPresent() && policeService.existsById(optAccount.get().getId())) {
            accountService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(403).build();
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<Account> acceptAccount(
        Authentication authentication,
        @PathVariable Integer id) {
        String currentPrincipalName = authentication.getName();
        Optional<Account> optAccount = accountService.findByUsername(currentPrincipalName);
        if (optAccount.isPresent() && policeService.existsById(optAccount.get().getId())) {
            Account account = accountService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));
            account.setAccountStatus(true);
            Account updatedAccount = accountService.save(account);
            return ResponseEntity.ok(updatedAccount);
        }
        return ResponseEntity.status(403).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAccount(
        Authentication authentication,
        @PathVariable Integer id,
        @org.springframework.web.bind.annotation.RequestBody AccountDTO accountDTO) {
        
        if (authentication == null) {
            return ResponseEntity.status(401).body("Authentication required");
        }

        String currentUsername = authentication.getName();
        Optional<Account> currentAccountOpt = accountService.findByUsername(currentUsername);
        
        if (currentAccountOpt.isEmpty()) {
            return ResponseEntity.status(401).body("User not found");
        }

        Account currentAccount = currentAccountOpt.get();
        
        // Check if user is updating their own account or is a police officer
        boolean isOwnAccount = currentAccount.getId().equals(id);
        boolean isPolice = policeService.existsById(currentAccount.getId());
        
        if (!isOwnAccount && !isPolice) {
            return ResponseEntity.status(403).body("Access denied");
        }

        try {
            Account accountToUpdate = accountService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));

            // Update fields
            if (accountDTO.getUsername() != null) {
                accountToUpdate.setUsername(accountDTO.getUsername());
            }
            if (accountDTO.getEmail() != null) {
                accountToUpdate.setEmail(accountDTO.getEmail());
            }
            if (accountDTO.getFullName() != null) {
                accountToUpdate.setFullName(accountDTO.getFullName());
            }
            if (accountDTO.getPhone() != null) {
                accountToUpdate.setPhone(accountDTO.getPhone());
            }
            if (accountDTO.getBirthday() != null) {
                accountToUpdate.setBirthday(accountDTO.getBirthday());
            }
            if (accountDTO.getAddress() != null) {
                accountToUpdate.setAddress(accountDTO.getAddress());
            }
            if (accountDTO.getGender() != null) {
                accountToUpdate.setGender(accountDTO.getGender());
            }
            if (accountDTO.getProfilePictureUrl() != null) {
                accountToUpdate.setProfilePictureUrl(accountDTO.getProfilePictureUrl());
            }

            Account updatedAccount = accountService.updateProfile(id ,accountToUpdate);
            
            // Return DTO without password
            AccountDTO responseDTO = AccountDTO.builder()
                    .id(updatedAccount.getId())
                    .username(updatedAccount.getUsername())
                    .email(updatedAccount.getEmail())
                    .fullName(updatedAccount.getFullName())
                    .birthday(updatedAccount.getBirthday())
                    .address(updatedAccount.getAddress())
                    .gender(updatedAccount.getGender())
                    .phone(updatedAccount.getPhone())
                    .profilePictureUrl(updatedAccount.getProfilePictureUrl())
                    .accountType(updatedAccount.getAccountType())
                    .build();
            
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating account: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(
        Authentication authentication,
        @PathVariable Integer id,
        @org.springframework.web.bind.annotation.RequestBody Map<String, String> passwordData) {
        
        if (authentication == null) {
            return ResponseEntity.status(401).body("Authentication required");
        }

        String currentUsername = authentication.getName();
        Optional<Account> currentAccountOpt = accountService.findByUsername(currentUsername);
        
        if (currentAccountOpt.isEmpty()) {
            return ResponseEntity.status(401).body("User not found");
        }

        Account currentAccount = currentAccountOpt.get();
        
        // Only allow users to change their own password
        if (!currentAccount.getId().equals(id)) {
            return ResponseEntity.status(403).body("You can only change your own password");
        }

        String currentPassword = passwordData.get("currentPassword");
        String newPassword = passwordData.get("newPassword");

        if (currentPassword == null || newPassword == null) {
            return ResponseEntity.status(400).body("Current password and new password are required");
        }

        try {
            Account account = accountService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));

            // Verify current password
            org.springframework.security.crypto.password.PasswordEncoder encoder = 
                new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
            
            if (!encoder.matches(currentPassword, account.getPassword())) {
                return ResponseEntity.status(400).body("Current password is incorrect");
            }

            // Update password
            account.setPassword(newPassword); // Will be encoded in save method
            accountService.save(account);
            
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error changing password: " + e.getMessage());
        }
    }
}
