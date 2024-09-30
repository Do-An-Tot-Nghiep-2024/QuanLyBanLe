package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.models.Category;
import com.bac.se.backend.payload.response.CategoryResponse;
import com.bac.se.backend.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;


    public List<CategoryResponse> getCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(category -> new CategoryResponse(category.getId(), category.getName()))
                .toList();
    }

    public CategoryResponse createCategory(String categoryName) throws BadRequestUserException {
        if (categoryName.isEmpty()) {
            throw new BadRequestUserException("Name is required");
        }

        var save = categoryRepository.save(Category.builder()
                .name(categoryName)
                .build());
        return new CategoryResponse(save.getId(), save.getName());
    }

    public void deleteCategory(Long id) {
        categoryRepository.findById(id)
                .ifPresentOrElse(
                        categoryRepository::delete,
                        () -> {
                            throw new ResourceNotFoundException("Customer not found");
                        }
                );
    }

    public CategoryResponse getCategory(Long id) {
        var category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return new CategoryResponse(category.getId(), category.getName());
    }

    public CategoryResponse updateCategory(String categoryName, Long id) throws BadRequestUserException {
        if (categoryName.isEmpty()) {
            throw new BadRequestUserException("Name is required");
        }
        categoryRepository.findById(id)
                .ifPresentOrElse(
                        categoryRepository::save,
                        () -> {
                            throw new ResourceNotFoundException("Category not found");
                        }
                );
        return new CategoryResponse(id, categoryName);
    }
}
