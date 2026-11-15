package com.shopsphere.category;

import com.shopsphere.category.dto.CategoryResponse;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    /**
     * Returns the full category hierarchy as a recursive tree.
     */
    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategoryTree() {
        // Fetch only the root categories (parent_id IS NULL)
        List<Category> rootCategories = categoryRepository.findByParentIsNullAndActiveTrueOrderByDisplayOrderAsc();

        // Recursively convert them to DTOs
        return rootCategories.stream()
                .map(this::mapToTreeDto)
                .collect(Collectors.toList());
    }

    /**
     * Returns a flat list of all active categories (useful for dropdown selectors).
     */
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllActiveFlat() {
        return categoryRepository.findByActiveTrueOrderByDisplayOrderAsc().stream()
                .map(cat -> CategoryResponse.builder()
                        .id(cat.getId())
                        .name(cat.getName())
                        .slug(cat.getSlug())
                        .description(cat.getDescription())
                        .imageUrl(cat.getImageUrl())
                        .displayOrder(cat.getDisplayOrder())
                        .build()
                )
                .collect(Collectors.toList());
    }

    /**
     * Recursive mapper: Converts a Category entity and its children into CategoryResponse DTO.
     */
    private CategoryResponse mapToTreeDto(Category category) {
        List<CategoryResponse> childDtos = null;

        if (category.getSubCategories() != null && !category.getSubCategories().isEmpty()) {
            childDtos = category.getSubCategories().stream()
                    .filter(Category::isActive)
                    .map(this::mapToTreeDto) // Recursion
                    .collect(Collectors.toList());
        }

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .displayOrder(category.getDisplayOrder())
                .subCategories(childDtos)
                .build();
    }

    /**
     * Auto-seed demo categories on startup if the database table is empty!
     * This ensures you immediately have real data to test in Swagger and React.
     */
    @PostConstruct
    @Transactional
    public void seedInitialCategories() {
        if (categoryRepository.count() > 0) {
            return; // Data already exists, do nothing
        }

        // 1. Root: Electronics
        Category electronics = Category.builder()
                .name("Electronics")
                .slug("electronics")
                .description("Smartphones, computing, cameras, and audio")
                .displayOrder(1)
                .build();
        categoryRepository.save(electronics);

        // Subcategories for Electronics
        Category laptops = Category.builder()
                .name("Computers & Laptops")
                .slug("computers-laptops")
                .parent(electronics)
                .displayOrder(1)
                .build();
        Category phones = Category.builder()
                .name("Smartphones")
                .slug("smartphones")
                .parent(electronics)
                .displayOrder(2)
                .build();
        categoryRepository.saveAll(List.of(laptops, phones));

        // 2. Root: Fashion
        Category fashion = Category.builder()
                .name("Fashion & Apparel")
                .slug("fashion-apparel")
                .description("Clothing, footwear, and accessories")
                .displayOrder(2)
                .build();
        categoryRepository.save(fashion);

        // Subcategories for Fashion
        Category mens = Category.builder()
                .name("Men's Wear")
                .slug("mens-wear")
                .parent(fashion)
                .displayOrder(1)
                .build();
        Category womens = Category.builder()
                .name("Women's Wear")
                .slug("womens-wear")
                .parent(fashion)
                .displayOrder(2)
                .build();
        categoryRepository.saveAll(List.of(mens, womens));

        // 3. Root: Home & Living
        Category home = Category.builder()
                .name("Home & Living")
                .slug("home-living")
                .description("Furniture, decor, and kitchen essentials")
                .displayOrder(3)
                .build();
        categoryRepository.save(home);
    }
}