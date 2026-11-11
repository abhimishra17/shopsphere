package com.shopsphere.user;
/**
 * Role Enum representing user privileges across the platform.
 *
 * Prefix 'ROLE_' follows the Spring Security standard naming convention.
 * - ROLE_CUSTOMER : Standard shopper (storefront, cart, checkout, orders)
 * - ROLE_SELLER   : Merchant (product CRUD, stock management, sales)
 * - ROLE_ADMIN    : Platform administrator (KYC, moderation, audit)
 */
public enum Role {
    ROLE_CUSTOMER,
    ROLE_SELLER,
    ROLE_ADMIN
}
