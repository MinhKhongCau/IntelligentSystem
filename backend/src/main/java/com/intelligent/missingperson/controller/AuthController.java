package com.intelligent.missingperson.controller;

import com.intelligent.missingperson.dto.LoginRequest;
import com.intelligent.missingperson.dto.LoginResponse;
import com.intelligent.missingperson.dto.RegisterRequest;
import com.intelligent.missingperson.entity.Account;
import com.intelligent.missingperson.security.JwtTokenProvider;
import com.intelligent.missingperson.service.AccountService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AccountService accountService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Optional<Account> optAccount = accountService.findByUsername(loginRequest.getUsername());
        if (optAccount.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            // Do not expose password
            Account account = optAccount.get();
            account.setPassword(null);

            LoginResponse loginResponse = LoginResponse.builder()
                .accessToken(jwt)
                .account(account)
                .build();

            return ResponseEntity.ok(loginResponse);
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        System.out.println("---> RegisterRequest: " + registerRequest);

        Account account = Account.builder()
                .username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .email(registerRequest.getEmail())
                .fullName(registerRequest.getFullName())
                .birthday(registerRequest.getBirthday())
                .address(registerRequest.getAddress())
                .gender(registerRequest.getGender())
                .phone(registerRequest.getPhone())
                .profilePictureUrl(registerRequest.getProfilePictureUrl())
                .build();

        Account saved = accountService.save(account);
        saved.setPassword(null);

        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "User registered successfully!");
        resp.put("account", saved);

        return ResponseEntity.created(URI.create("/api/auth/" + saved.getId())).body(resp);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("User logged out successfully!");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("User not authenticated");
        }

        String username = authentication.getName();
        Optional<Account> opt = accountService.findByUsername(username);
        if (opt.isEmpty()) {
            return ResponseEntity.status(401).body("User not found");
        }

        Account account = opt.get();
        account.setPassword(null);
        return ResponseEntity.ok(account);
    }
}