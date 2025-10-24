package com.intelligent.missingperson.entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"police","carePartner","volunteer","detailAreaAccounts"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "ACCOUNT", schema = "dbo", uniqueConstraints = {
        @UniqueConstraint(columnNames = "Username"),
        @UniqueConstraint(columnNames = "Email")
})
public class Account implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    @EqualsAndHashCode.Include
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
    @Column(name = "Address", columnDefinition = "nvarchar(max)")
    private String address;

    @Column(name = "Gender")
    private Boolean gender;

    @Column(name = "Phone", length = 20)
    private String phone;

    @Lob
    @Column(name = "ProfilePictureUrl", columnDefinition = "varchar(max)")
    private String profilePictureUrl;

    @Column(name = "AccountType", nullable = false, length = 50)
    private String accountType;

    @Column(name = "AccountStatus", nullable = false)
    @Builder.Default
    private boolean accountStatus = true;

    @Column(name = "CreatedAt", nullable = false)
    private LocalDateTime createdAt;

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = true)
    private Police police;

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = true)
    private CarePartner carePartner;

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = true)
    private Volunteer volunteer;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<DetailAreaAccount> detailAreaAccounts = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}