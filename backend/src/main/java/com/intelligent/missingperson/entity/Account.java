package com.intelligent.missingperson.entity;

import java.util.Date;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Account")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @NotBlank(message = "Username is required")
    @Size(max = 255, message = "Username must not exceed 255 characters")
    @Column(name = "Username", unique = true, nullable = false)
    private String username;

    @NotBlank(message = "Password is required")
    @Size(max = 255, message = "Password must not exceed 255 characters")
    @Column(name = "PasswordHash", nullable = false)
    private String passwordHash;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    @Column(name = "Email", unique = true, nullable = false)
    private String email;

    @Size(max = 20, message = "Phone must not exceed 20 characters")
    @Column(name = "PhoneNumber")
    private String phoneNumber;

    @Size(max = 255, message = "FullName must not exceed 255 characters")
    @Column(name = "FullName")
    private String fullName;

    @NotBlank(message = "Role is required")
    @Size(max = 50, message = "Role must not exceed 50 characters")
    @Column(name = "Role", nullable = false)
    private String role;

    @Column(name = "DateJoined", nullable = false)
    private Date dateJoined;

    @Column(name = "Status", nullable = false)
    private boolean status; // 1 = Active, 0 = Inactive
}
