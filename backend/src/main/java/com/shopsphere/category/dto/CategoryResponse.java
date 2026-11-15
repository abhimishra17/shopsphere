package com.shopsphere.category.dto;

import lombok.*;

import java.util.List;

/**
 * Category Response DTO
 *
 * Packages category data into a recursive JSON structure so the React frontend
 * can render nested dropdown menus and category pills with subcategories.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
    private Integer displayOrder;

    // Nested children list (recursive)
    private List<CategoryResponse> subCategories;
}