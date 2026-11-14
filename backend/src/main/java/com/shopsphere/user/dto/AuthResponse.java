package com.shopsphere.user.dto;

import lombok.*;

/**
 * Payload returned to the client upon successful registration or login.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String accessToken;
    private String tokenType;
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
}
