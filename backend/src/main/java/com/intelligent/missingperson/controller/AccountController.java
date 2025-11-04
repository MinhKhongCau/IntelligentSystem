package com.intelligent.missingperson.controller;

import java.security.Principal;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.intelligent.missingperson.entity.Account;
import com.intelligent.missingperson.service.AccountService;
import com.intelligent.missingperson.service.PoliceService;

@RestController
@RequestMapping("/api")   
public class AccountController {
    @Autowired
    private AccountService accountService;


    @Autowired
    private PoliceService policeService;

    @GetMapping("/accounts")
    public ResponseEntity<?> getAccountsPage(
        @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC)Pageable pageable,
        Principal principal) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        System.out.println("===> Current User: " + currentPrincipalName);
        Optional<Account> optAccount = accountService.findByUsername(currentPrincipalName);
        if (policeService.existsById(optAccount.get().getId())) {
            return ResponseEntity.ok(accountService.findAll(pageable));
        }
        return ResponseEntity.status(403).body("Access denied");
    }

    @DeleteMapping("/accounts/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        Optional<Account> optAccount = accountService.findByUsername(currentPrincipalName);
        if (policeService.existsById(optAccount.get().getId())) {
            accountService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(403).build();
    }

    @PutMapping("/accounts/{id}/accept")
    public ResponseEntity<Account> acceptAccount(@PathVariable Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        Optional<Account> optAccount = accountService.findByUsername(currentPrincipalName);
        if (policeService.existsById(optAccount.get().getId())) {
            Account account = accountService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));
            account.setAccountStatus(true);
            Account updatedAccount = accountService.save(account);
            return ResponseEntity.ok(updatedAccount);
        }
        return ResponseEntity.status(403).build();
    }
}
