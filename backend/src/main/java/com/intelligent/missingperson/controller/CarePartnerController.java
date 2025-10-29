package com.intelligent.missingperson.controller;

import com.intelligent.missingperson.dto.RegisterCarePartnerRequest;
import com.intelligent.missingperson.entity.Account;
import com.intelligent.missingperson.entity.CarePartner;
import com.intelligent.missingperson.service.AccountService;
import com.intelligent.missingperson.service.CarePartnerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/care-partners")
@CrossOrigin(origins = "*")
public class CarePartnerController {

    @Autowired
    private CarePartnerService carePartnerservice;

    @Autowired
    private AccountService accountService;


    @GetMapping
    public List<CarePartner> getAllCarePartners() {
        return carePartnerservice.findAll();
    }

    @GetMapping("/{id}")
    public CarePartner getCarePartnerById(@PathVariable Integer id) {
        return carePartnerservice.findById(id).orElse(null);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerCarePartner(@RequestBody RegisterCarePartnerRequest request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated.");
        }
        String username = authentication.getName();
        Optional<Account> accountOpt = accountService.findByUsername(username);
        if (!accountOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Authenticated account not found.");
        }
        Account account = accountOpt.get();
        if (carePartnerservice.findById(account.getId()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Account is already registered as a Care Partner.");
        }
        CarePartner newCarePartner = CarePartner.builder()
                .account(account)
                .partnerType(request.getPartnerType())  
                .organizationName(request.getOrganizationName())
                .partnerStatus(true)
                .build();
        CarePartner savedPartner =  carePartnerservice.save(newCarePartner);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPartner);
        // Return 201 Created with the location of the new resource
    }
}
