package com.intelligent.missingperson.controller;

import java.util.List;
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
                        .accountStatus(account.getAccountStatus())
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
}
