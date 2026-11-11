package com.shopsphere.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * UserRepository Interface
 *
 * Extends JpaRepository to provide out-of-the-box CRUD methods:
 * save, findById, findAll, deleteById, count, etc.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by email.
     * Used by Spring Security and AuthService during login to fetch the user credentials.
     *
     * @param email user's email address
     * @return Optional containing the User if found, empty Optional otherwise
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if an account already exists with this email.
     * Used during customer/seller registration to prevent duplicate accounts.
     *
     * @param email user's email address
     * @return true if the email is already registered, false otherwise
     */
    boolean existsByEmail(String email);
}