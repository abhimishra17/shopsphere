package com.shopsphere.category;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Category Entity
 *
 * Represents product categories arranged in an arbitrary depth tree.
 * Uses a self-referencing @ManyToOne and @OneToMany relationship.
 */
@Entity
@Table(
        name = "categories",
        indexes = {
                @Index(name = "idx_category_slug", columnList = "slug", unique = true)
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // e.g. "Consumer Electronics"
    @Column(nullable = false, length = 100)
    private String name;

    // URL-friendly identifier: e.g. "consumer-electronics"
    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;

    // Allows soft-toggling category visibility on the storefront
    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    // Display sort order among sibling categories
    @Builder.Default
    private Integer displayOrder = 0;

    /**
     * SELF-REFERENCE: Parent Category
     * If parent is null -> This is a Top-Level Root Category.
     * FetchType.LAZY avoids loading the parent eagerly into memory.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;

    /**
     * SELF-REFERENCE: Child Subcategories
     * Automatically retrieves all categories whose parent_id equals this category's id.
     */
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Category> subCategories = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}