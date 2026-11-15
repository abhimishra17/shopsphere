package com.shopsphere.category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * Finds all root categories (categories where parent is NULL) that are active,
     * ordered by displayOrder ascending.
     */
    List<Category> findByParentIsNullAndActiveTrueOrderByDisplayOrderAsc();

    /**
     * Finds all active categories regardless of depth (for flat lists and search filters).
     */
    List<Category> findByActiveTrueOrderByDisplayOrderAsc();

    /**
     * Lookup by URL slug (e.g. /category/electronics)
     */
    Optional<Category> findBySlug(String slug);

    boolean existsBySlug(String slug);
}