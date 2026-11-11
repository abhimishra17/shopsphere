package com.shopsphere.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

/**
 * User Entity
 *
 * Represents the primary user account in MySQL ('users' table).
 * Implements Spring Security's 'UserDetails' interface so Spring Security
 * and JWT filters can directly authenticate and inspect authorities.
 */
@Entity
@Table(
        name = "users",
        indexes = {
                @Index(name = "idx_users_email", columnList = "email", unique = true)
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Email is used as the unique username for login
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    // Encrypted password (BCrypt hash)
    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 50)
    private String firstName;

    @Column(nullable = false, length = 50)
    private String lastName;

    @Column(length = 20)
    private String phone;

    // Persist enum as a readable string: 'ROLE_CUSTOMER', 'ROLE_SELLER', 'ROLE_ADMIN'
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Role role;

    // Account status flag
    @Builder.Default
    @Column(nullable = false)
    private boolean enabled = true;

    // Auto-populated on entity creation
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Auto-updated on every entity modification
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // =========================================================================
    // Spring Security 'UserDetails' Contract Implementation
    // =========================================================================

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Converts the Role enum into a Spring Security GrantedAuthority
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        // In ShopSphere, the email is the login identifier
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}