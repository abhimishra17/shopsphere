package com.shopsphere.product.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Comprehensive DTO for the Product Details page.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDetailResponse {
    private Long id;
    private String title;
    private String slug;
    private String description;
    private String brand;
    private BigDecimal basePrice;
    private Double averageRating;
    private Integer reviewCount;
    private String categoryName;
    private String categorySlug;
    private List<String> imageUrls;
    private List<ProductVariantResponse> variants;
}