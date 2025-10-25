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
    @Column(name = "id")
    @EqualsAndHashCode.Include
    private Integer id;

    @Column(name = "username", nullable = false, length = 255)
    private String username;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "fullName", length = 255)
    private String fullName;

    @Column(name = "birthday")
    private LocalDate birthday;

    @Lob
    @Column(name = "address", columnDefinition = "nvarchar(max)")
    private String address;

    @Column(name = "Gender")
    private Boolean gender;

    @Column(name = "phone", length = 20)
    private String phone;

    @Lob
    @Column(name = "profile_picture_url", columnDefinition = "varchar(max)")
    private String profilePictureUrl;

    @Column(name = "account_type", nullable = false, length = 50)
    private String accountType;

    @Column(name = "account_status", nullable = false, insertable = false)
    @Builder.Default
    private boolean accountStatus = true;

    @Column(name = "created_at", nullable = false)
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
        if (accountType == null) accountType = "VOLUNTEER";
    }
}