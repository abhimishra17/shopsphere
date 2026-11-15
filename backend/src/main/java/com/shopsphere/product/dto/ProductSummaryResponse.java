package com.shopsphere.product.dto;

import lombok.*;

import java.math.BigDecimal;

/**
 * Lightweight DTO for grid cards in storefront and search results.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSummaryResponse {
    private Long id;
    private String title;
    private String slug;
    private String brand;
    private BigDecimal basePrice;
    private String primaryImageUrl;
    private Double averageRating;
    private Integer reviewCount;
    private String categoryName;
    private String categorySlug;
    private boolean inStock;
}