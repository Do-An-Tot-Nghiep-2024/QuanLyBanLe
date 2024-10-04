package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.models.Category;
import com.bac.se.backend.payload.request.CategoryRequest;
import com.bac.se.backend.payload.response.CategoryResponse;
import com.bac.se.backend.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    static final String CATEGORY_NOT_FOUND = "Không tìm thấy danh mục";

    public List<CategoryResponse> getCategories() {
        return categoryRepository.getCategories()
                .stream()
                .map(category -> new CategoryResponse(
                        Long.parseLong(category[0].toString()),
                        (String) category[1]))
                .toList();
    }

    public CategoryResponse createCategory(CategoryRequest categoryRequest) throws BadRequestUserException {
        if (categoryRequest.name().isEmpty()) {
            throw new BadRequestUserException("Vui lòng nhập tên danh mục");
        }

        Category category = Category.builder()
                .name(categoryRequest.name())
                .isActive(true)
                .build();
        var save = categoryRepository.save(category);
        return new CategoryResponse(save.getId(), save.getName());
    }

    public void deleteCategory(Long id) {
        var category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(CATEGORY_NOT_FOUND));
        category.setActive(false);
        categoryRepository.save(category);
    }

    public CategoryResponse getCategory(Long id) {
        var category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(CATEGORY_NOT_FOUND));
        return new CategoryResponse(category.getId(), category.getName());
    }

    public CategoryResponse updateCategory(CategoryRequest categoryRequest, Long id) throws BadRequestUserException {
        if (categoryRequest.name().isEmpty()) {
            throw new BadRequestUserException("Vui lòng nhập tên danh mục");
        }
        categoryRepository.findById(id)
                .ifPresentOrElse(
                        categoryRepository::save,
                        () -> {
                            throw new ResourceNotFoundException(CATEGORY_NOT_FOUND);
                        }
                );
        return new CategoryResponse(id, categoryRequest.name());
    }
}
