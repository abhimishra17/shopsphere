package com.shopsphere.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * =============================================================================
 * JwtAuthenticationFilter - The Security Gatekeeper / Interceptor
 * =============================================================================
 * 
 * WHAT DOES THIS FILTER DO?
 * -------------------------
 * This filter intercepts EVERY single HTTP request sent to our Spring Boot backend.
 * It looks for the 'Authorization: Bearer <token>' header:
 * - If present & valid: It extracts the user identity, checks the database, and 
 *   registers the user into Spring Security's context for this request thread.
 * - If absent: It allows the request to continue downstream (e.g., to public endpoints 
 *   like /api/v1/auth/login, or to be rejected by Spring Security if the endpoint is secured).
 * 
 * ANNOTATION EXPLANATIONS:
 * ------------------------
 * @Component:
 *   - Registers this filter as a Spring-managed Bean so Spring can discover it,
 *     manage its lifecycle, and allow it to be injected into SecurityConfig.
 * 
 * @RequiredArgsConstructor (Lombok):
 *   - Automatically creates a constructor for all 'final' fields (jwtService & userDetailsService).
 *   - Enables clean, constructor-based Dependency Injection without writing boilerplate code:
 *       public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
 *           this.jwtService = jwtService;
 *           this.userDetailsService = userDetailsService;
 *       }
 * 
 * extends OncePerRequestFilter:
 *   - Guarantees that this filter is executed EXACTLY ONCE per incoming HTTP request.
 *   - Prevents duplicate filter execution in complex servlet dispatching (like forward/include requests).
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // Helper service to decode, inspect, and validate JWT tokens
    private final JwtService jwtService;

    // Service to fetch user details (credentials, roles, enabled status) from MySQL
    private final UserDetailsService userDetailsService;

    /**
     * Core filter execution method.
     * 
     * @param request     Incoming HTTP request (headers, method, body, path).
     * @param response    Outgoing HTTP response.
     * @param filterChain Chain of security filters to pass the request along to.
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // =====================================================================
        // STEP 1: Read the 'Authorization' header from incoming request
        // =====================================================================
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        /**
         * Standard HTTP format: 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...'
         * 
         * If:
         * 1. No Authorization header was sent (e.g., public endpoints like /api/v1/auth/login), OR
         * 2. The header does NOT start with "Bearer " (unknown/unsupported auth scheme)
         * 
         * -> Pass the request to the next filter in the chain and RETURN immediately.
         * -> Spring Security will permit it if it's whitelisted, or return 401/403 if it requires auth.
         */
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // =====================================================================
        // STEP 2: Extract the raw token string
        // =====================================================================
        // The word "Bearer " is exactly 7 characters long.
        // substring(7) cuts off "Bearer " and leaves only the raw token string:
        jwt = authHeader.substring(7);

        // =====================================================================
        // STEP 3: Extract the user email (subject) from the token
        // =====================================================================
        userEmail = jwtService.extractUsername(jwt);

        /**
         * =====================================================================
         * STEP 4: Check if user is already authenticated in this thread
         * =====================================================================
         * 
         * 1. (userEmail != null): Token must contain a valid subject (email).
         * 2. (SecurityContextHolder.getContext().getAuthentication() == null):
         *    SecurityContextHolder is Spring's memory of who is currently logged in.
         *    If getAuthentication() is null, this request hasn't been authenticated yet.
         *    If it is NOT null, the user is already authenticated (avoid redundant DB lookups).
         */
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Fetch the user from MySQL database via ApplicationConfig's userDetailsService bean
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            /**
             * =================================================================
             * STEP 5: Cryptographically validate the token
             * =================================================================
             * Verifies:
             * 1. Token's email matches the user in the database.
             * 2. Token expiration timestamp is still in the future.
             * 3. HMAC-SHA256 signature is valid and untampered.
             */
            if (jwtService.isTokenValid(jwt, userDetails)) {

                /**
                 * Create an authenticated token badge:
                 * - principal: userDetails (who the user is)
                 * - credentials: null (we don't keep passwords in memory after auth)
                 * - authorities: userDetails.getAuthorities() (their roles: ROLE_CUSTOMER, etc.)
                 */
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                // Build request details (IP address, session ID) into the authentication token
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                /**
                 * =============================================================
                 * STEP 6: Register the user into Spring Security Context
                 * =============================================================
                 * From this point forward, Spring Security treats this request as
                 * fully authenticated. Downstream controllers can access the user via:
                 * @AuthenticationPrincipal User currentUser, or
                 * SecurityContextHolder.getContext().getAuthentication()
                 */
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // =====================================================================
        // STEP 7: Always continue the filter chain to reach the target controller
        // =====================================================================
        filterChain.doFilter(request, response);
    }
}
