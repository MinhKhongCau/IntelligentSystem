package com.intelligent.missingperson.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "ACCOUNT", uniqueConstraints = {
    @UniqueConstraint(columnNames = "Username"),
    @UniqueConstraint(columnNames = "Email")
})
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @Column(name = "Username", nullable = false, length = 255)
    private String username;

    @Column(name = "Password", nullable = false, length = 255)
    private String password;

    @Column(name = "Email", nullable = false, length = 255)
    private String email;

    @Column(name = "FullName", length = 255)
    private String fullName;

    @Column(name = "Birthday")
    private LocalDate birthday;

    @Lob 
    @Column(name = "Address")
    private String address;

    @Column(name = "Gender")
    private Boolean gender; // BIT

    @Column(name = "Phone", length = 20)
    private String phone;

    @Lob 
    @Column(name = "ProfilePictureUrl")
    private String profilePictureUrl;

    @Column(name = "AccountType", nullable = false, length = 50)
    private String accountType;

    @Column(name = "AccountStatus", nullable = false)
    private boolean accountStatus = true; // DEFAULT 1

    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // --- Relationships ---

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Police police;

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Volunteer volunteer;

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private CarePartner carePartner;

    @OneToMany(mappedBy = "account")
    private Set<DetailAreaAccount> detailAreaAccounts;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}