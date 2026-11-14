package com.shopsphere.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * =============================================================================
 * JwtService - The Cryptographic Token Engine (Mint & Verify)
 * =============================================================================
 * 
 * WHAT IS A JWT (JSON Web Token)?
 * --------------------------------
 * A JWT is a compact, URL-safe, digitally signed string representing claims 
 * (data) transferred between client and server in REST APIs.
 * It consists of 3 parts separated by dots: [Header].[Payload].[Signature]
 * 
 * 1. HEADER: Contains the signing algorithm used (HMAC-SHA256).
 * 2. PAYLOAD (Claims): Contains the data (e.g., email/username, role, expiration).
 * 3. SIGNATURE: Cryptographic seal produced using our server-side SECRET KEY.
 *    If anyone tampers with the payload, the signature becomes invalid!
 * 
 * ANNOTATION EXPLANATION:
 * ----------------------
 * @Service:
 *   - A Spring stereotype annotation indicating that this class holds business logic.
 *   - Tells the Spring IoC (Inversion of Control) container to instantiate this class 
 *     as a singleton Bean and make it available for dependency injection (@Autowired 
 *     or constructor injection) in other classes like AuthService and JwtAuthenticationFilter.
 */
@Service
public class JwtService {

    /**
     * @Value("${application.security.jwt.secret-key}"):
     *   - Injects the secret key property defined in 'src/main/resources/application.yml'.
     *   - This secret string is known ONLY to the backend server.
     *   - Used to mathematically sign tokens when created and verify them when received.
     */
    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    /**
     * @Value("${application.security.jwt.expiration}"):
     *   - Injects token lifespan in milliseconds (e.g., 86400000 ms = 24 hours).
     *   - Once current time passes this duration, the token is rejected as expired.
     */
    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;

    // =========================================================================
    // 1. TOKEN GENERATION (MINTING)
    // =========================================================================

    /**
     * Overloaded helper: Generates a JWT with default claims (subject + timestamps).
     * 
     * @param userDetails The authenticated user details (holds email/username).
     * @return Compact serialized JWT string (header.payload.signature).
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * Generates a fully customized JWT with extra claims (such as user role).
     * 
     * Uses JJWT 0.12.x modern fluent builder:
     * - Jwts.builder()      : Initializes a new JWT builder.
     * - .claims(extraClaims): Embeds custom key-value pairs (e.g., "role": "ROLE_CUSTOMER").
     * - .subject(...)       : The primary identity claim ("sub"). We store the user's email.
     * - .issuedAt(...)      : Exact timestamp when token is created ("iat").
     * - .expiration(...)    : Expiry timestamp ("exp") = currentTime + lifespan.
     * - .signWith(...)      : Signs the payload using HMAC-SHA256 with our SecretKey.
     * - .compact()          : Serializes the JWT into a single compact base64-encoded string.
     * 
     * @param extraClaims Key-value pairs to store in the token payload.
     * @param userDetails User information (username / email).
     * @return Signed JWT string.
     */
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey())
                .compact();
    }

    // =========================================================================
    // 2. TOKEN PARSING & CLAIM EXTRACTION
    // =========================================================================

    /**
     * Extracts the subject (user's email) from the token.
     * 
     * @param token The raw JWT string.
     * @return User's email string.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Generic claim resolver helper using Java Functional Interface (Function<Claims, T>).
     * Allows extracting any specific claim (e.g., subject, expiration date, or custom claim).
     * 
     * @param token The raw JWT string.
     * @param claimsResolver Function describing which claim to extract.
     * @return The extracted claim value of type T.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Parses the JWT, verifies its cryptographic signature using our SecretKey,
     * and extracts all claims (the entire JSON payload).
     * 
     * IMPORTANT SECURITY NOTE:
     * If someone changed even a single character in the payload, or if the token
     * was signed by a different key, .parseSignedClaims() will fail and throw a
     * SignatureException, immediately blocking the request!
     * 
     * @param token The raw JWT string.
     * @return Claims object holding all key-value claims from the token payload.
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey()) // Verify signature against our SecretKey
                .build()
                .parseSignedClaims(token)   // Validates signature and unpacks claims
                .getPayload();
    }

    /**
     * Converts our Base64-encoded secret key string into a cryptographic SecretKey.
     * 
     * 1. Decoders.BASE64.decode(secretKey):
     *    Decodes the Base64 ASCII string into raw binary bytes.
     * 2. Keys.hmacShaKeyFor(keyBytes):
     *    Wraps the raw bytes into a cryptographic javax.crypto.SecretKey suitable 
     *    for the HMAC-SHA256 signature algorithm.
     */
    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // =========================================================================
    // 3. TOKEN VALIDATION
    // =========================================================================

    /**
     * Validates whether a token is valid for a given user.
     * Checks two conditions:
     * 1. Does the email extracted from the token match the database user's email?
     * 2. Has the token expired yet?
     * 
     * @param token The raw JWT string.
     * @param userDetails The user retrieved from database.
     * @return true if valid, false otherwise.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    /**
     * Checks if the token's expiration date has passed compared to the current system time.
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extracts the expiration date claim ("exp") from the token.
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
