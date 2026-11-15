package com.shopsphere.product;

import com.shopsphere.category.Category;
import com.shopsphere.category.CategoryRepository;
import com.shopsphere.product.dto.ProductDetailResponse;
import com.shopsphere.product.dto.ProductSummaryResponse;
import com.shopsphere.product.dto.ProductVariantResponse;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    /**
     * Search & Filter products with pagination
     */
    @Transactional(readOnly = true)
    public Page<ProductSummaryResponse> getProducts(
            String keyword,
            String categorySlug,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    ) {
        return productRepository.searchProducts(keyword, categorySlug, minPrice, maxPrice, pageable)
                .map(this::mapToSummary);
    }

    /**
     * Get featured products for homepage
     */
    @Transactional(readOnly = true)
    public List<ProductSummaryResponse> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndActiveTrue().stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    /**
     * Get single product detail by slug
     */
    @Transactional(readOnly = true)
    public ProductDetailResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with slug: " + slug));

        return mapToDetail(product);
    }

    /**
     * Get single product detail by ID
     */
    @Transactional(readOnly = true)
    public ProductDetailResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .filter(Product::isActive)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));

        return mapToDetail(product);
    }

    // Helper: Map to summary
    private ProductSummaryResponse mapToSummary(Product product) {
        String primaryImg = product.getImages().stream()
                .filter(ProductImage::isPrimary)
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElse(product.getImages().isEmpty() ? null : product.getImages().get(0).getImageUrl());

        boolean hasStock = product.getVariants().stream().anyMatch(ProductVariant::isAvailable);

        return ProductSummaryResponse.builder()
                .id(product.getId())
                .title(product.getTitle())
                .slug(product.getSlug())
                .brand(product.getBrand())
                .basePrice(product.getBasePrice())
                .primaryImageUrl(primaryImg)
                .averageRating(product.getAverageRating())
                .reviewCount(product.getReviewCount())
                .categoryName(product.getCategory().getName())
                .categorySlug(product.getCategory().getSlug())
                .inStock(hasStock)
                .build();
    }

    // Helper: Map to detail
    private ProductDetailResponse mapToDetail(Product product) {
        List<String> imageUrls = product.getImages().stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());

        List<ProductVariantResponse> variants = product.getVariants().stream()
                .map(v -> ProductVariantResponse.builder()
                        .id(v.getId())
                        .sku(v.getSku())
                        .size(v.getSize())
                        .color(v.getColor())
                        .price(v.getPrice())
                        .availableQuantity(v.getAvailableQuantity())
                        .isAvailable(v.isAvailable())
                        .build()
                )
                .collect(Collectors.toList());

        return ProductDetailResponse.builder()
                .id(product.getId())
                .title(product.getTitle())
                .slug(product.getSlug())
                .description(product.getDescription())
                .brand(product.getBrand())
                .basePrice(product.getBasePrice())
                .averageRating(product.getAverageRating())
                .reviewCount(product.getReviewCount())
                .categoryName(product.getCategory().getName())
                .categorySlug(product.getCategory().getSlug())
                .imageUrls(imageUrls)
                .variants(variants)
                .build();
    }

    /**
     * Auto-seed demo products on startup
     */
    @PostConstruct
    @Transactional
    public void seedInitialProducts() {
        if (productRepository.count() > 0) {
            return;
        }

        Category phones = categoryRepository.findBySlug("smartphones").orElse(null);
        Category laptops = categoryRepository.findBySlug("computers-laptops").orElse(null);
        Category fashion = categoryRepository.findBySlug("mens-wear").orElse(null);

        if (phones != null) {
            // Product 1: iPhone 15 Pro
            Product iphone = Product.builder()
                    .title("Apple iPhone 15 Pro")
                    .slug("apple-iphone-15-pro")
                    .description("Titanium design with A17 Pro chip, customizable Action button, and advanced 48MP camera.")
                    .brand("Apple")
                    .basePrice(new BigDecimal("999.00"))
                    .category(phones)
                    .featured(true)
                    .averageRating(4.8)
                    .reviewCount(142)
                    .build();

            iphone.addImage(ProductImage.builder()
                    .imageUrl("https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800")
                    .isPrimary(true)
                    .build());

            iphone.addVariant(ProductVariant.builder()
                    .sku("IPHONE-15-PRO-128-NAT")
                    .size("128GB")
                    .color("Natural Titanium")
                    .price(new BigDecimal("999.00"))
                    .stockQuantity(25)
                    .build());

            iphone.addVariant(ProductVariant.builder()
                    .sku("IPHONE-15-PRO-256-BLK")
                    .size("256GB")
                    .color("Black Titanium")
                    .price(new BigDecimal("1099.00"))
                    .stockQuantity(15)
                    .build());

            productRepository.save(iphone);
        }

        if (laptops != null) {
            // Product 2: MacBook Pro 14
            Product macbook = Product.builder()
                    .title("Apple MacBook Pro 14 (M3)")
                    .slug("apple-macbook-pro-14-m3")
                    .description("Stunning Liquid Retina XDR display, up to 22 hours of battery life, and pro connectivity.")
                    .brand("Apple")
                    .basePrice(new BigDecimal("1599.00"))
                    .category(laptops)
                    .featured(true)
                    .averageRating(4.9)
                    .reviewCount(98)
                    .build();

            macbook.addImage(ProductImage.builder()
                    .imageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800")
                    .isPrimary(true)
                    .build());

            macbook.addVariant(ProductVariant.builder()
                    .sku("MBP-14-M3-512-SLV")
                    .size("512GB SSD / 8GB RAM")
                    .color("Silver")
                    .price(new BigDecimal("1599.00"))
                    .stockQuantity(12)
                    .build());

            productRepository.save(macbook);
        }

        if (fashion != null) {
            // Product 3: Premium Oxford Shirt
            Product shirt = Product.builder()
                    .title("Classic Oxford Cotton Shirt")
                    .slug("classic-oxford-cotton-shirt")
                    .description("100% breathable organic cotton, button-down collar, regular fit suitable for work and casual wear.")
                    .brand("ShopSphere Heritage")
                    .basePrice(new BigDecimal("49.99"))
                    .category(fashion)
                    .featured(false)
                    .averageRating(4.6)
                    .reviewCount(53)
                    .build();

            shirt.addImage(ProductImage.builder()
                    .imageUrl("https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800")
                    .isPrimary(true)
                    .build());

            shirt.addVariant(ProductVariant.builder()
                    .sku("SHIRT-OXF-M-BLU")
                    .size("M")
                    .color("Light Blue")
                    .price(new BigDecimal("49.99"))
                    .stockQuantity(30)
                    .build());

            shirt.addVariant(ProductVariant.builder()
                    .sku("SHIRT-OXF-L-WHT")
                    .size("L")
                    .color("White")
                    .price(new BigDecimal("49.99"))
                    .stockQuantity(18)
                    .build());

            productRepository.save(shirt);
        }
    }
}