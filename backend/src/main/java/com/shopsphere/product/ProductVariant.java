package com.shopsphere.product;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(
    name = "product_variants",
    indexes = {
        @Index(name = "idx_variant_sku", columnList = "sku", unique = true)
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Unique SKU (Stock Keeping Unit), e.g. "IPHONE-15-128-NAT"
    @Column(nullable = false, unique = true, length = 80)
    private String sku;

    // e.g. "128GB", "256GB", "M", "L", "10"
    @Column(length = 50)
    private String size;

    // e.g. "Natural Titanium", "Black", "Midnight Blue"
    @Column(length = 50)
    private String color;

    // Price for this specific variant
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    // Physical stock count in warehouse
    @Column(nullable = false)
    private Integer stockQuantity;

    // Stock temporarily reserved by customers during checkout
    @Builder.Default
    @Column(nullable = false)
    private Integer reservedQuantity = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    /**
     * Available stock = Physical stock minus currently reserved items
     */
    public Integer getAvailableQuantity() {
        return Math.max(0, stockQuantity - reservedQuantity);
    }

    public boolean isAvailable() {
        return getAvailableQuantity() > 0;
    }
}