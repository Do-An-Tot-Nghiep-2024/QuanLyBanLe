package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.models.Category;
import com.bac.se.backend.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public void createCategory(Category category) throws BadRequestUserException {
        if(category.getName().isEmpty()){
            throw new BadRequestUserException("Name is required");
        }
        categoryRepository.save(category);
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

    public Category getCategory(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Not found category"));
    }

    public Category updateCategory(Category category, Long id) throws BadRequestUserException {
        if(category.getName().isEmpty()){
            throw new BadRequestUserException("Name is required");
        }
        categoryRepository.findById(id)
                .ifPresentOrElse(
                        categoryRepository::save,
                        () -> {
                            throw new ResourceNotFoundException("Category not found");
                        }
                );
        return category;
    }
}
