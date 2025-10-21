package com.intelligent.missingperson.controller;

import com.intelligent.missingperson.dto.JwtAuthenticationResponse;
import com.intelligent.missingperson.dto.LoginRequest;
import com.intelligent.missingperson.dto.RegisterRequest;
import com.intelligent.missingperson.entity.Account;
import com.intelligent.missingperson.repository.AccountRepository;
import com.intelligent.missingperson.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        System.out.println("-----> loginRequest: " + loginRequest.getUsername());
        java.util.Optional<Account> optAccount = accountRepository.findByUsername(loginRequest.getUsername());
        if (!optAccount.isPresent()) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        Account account = optAccount.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), account.getPassword())) {
            System.out.println("-----> get account unsuccessfully: " + account.getUsername());
            return ResponseEntity.status(401).body("Invalid username or password");
        }
        System.out.println("-----> get account successfully: " + account.getUsername());
        
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        account.setPassword(null);
        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (accountRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        if (accountRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // build Account using setters (Account has no all-args constructor / builder)
        Account account = new Account();
        account.setUsername(registerRequest.getUsername());
        account.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        account.setEmail(registerRequest.getEmail());
        account.setFullName(registerRequest.getFullName());
        account.setBirthday(registerRequest.getBirthday());
        account.setAddress(registerRequest.getAddress());
        account.setGender(registerRequest.getGender());
        account.setPhone(registerRequest.getPhone());
        account.setProfilePictureUrl(registerRequest.getProfilePictureUrl());
        account.setAccountType(registerRequest.getAccountType());

        accountRepository.save(account);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        // Clear the security context
        SecurityContextHolder.clearContext();
        
        return ResponseEntity.ok("User logged out successfully!");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("User not authenticated");
        }
        
        String username = authentication.getName();
        return ResponseEntity.ok(new java.util.HashMap<String, String>() {{
            put("username", username);
            put("authenticated", "true");
        }});
    }
}
