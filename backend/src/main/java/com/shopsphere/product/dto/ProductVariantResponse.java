package com.shopsphere.product.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariantResponse {
    private Long id;
    private String sku;
    private String size;
    private String color;
    private BigDecimal price;
    private Integer availableQuantity;
    private boolean isAvailable;
}