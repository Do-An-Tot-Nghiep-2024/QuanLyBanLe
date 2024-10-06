package com.bac.se.backend.services.impl;

import com.bac.se.backend.exceptions.AlreadyExistsException;
import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.models.Category;
import com.bac.se.backend.payload.request.CategoryRequest;
import com.bac.se.backend.payload.response.CategoryResponse;
import com.bac.se.backend.repositories.CategoryRepository;
import com.bac.se.backend.services.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    static final String CATEGORY_NOT_FOUND = "Không tìm thấy danh mục";

    @Override
    public List<CategoryResponse> getCategories() {
        return categoryRepository.getCategories()
                .stream()
                .map(category -> new CategoryResponse(
                        Long.parseLong(category[0].toString()),
                        (String) category[1]))
                .toList();
    }

    @Override
    public CategoryResponse createCategory(CategoryRequest categoryRequest) throws BadRequestUserException {


        if (categoryRequest.name().isEmpty()) {
            throw new BadRequestUserException("Vui lòng nhập tên danh mục");
        }

        if(categoryRepository.existsByName(categoryRequest.name())){
            throw new AlreadyExistsException("Danh mục đã tồn tại");
        }

        Category category = Category.builder()
                .name(categoryRequest.name())
                .isActive(true)
                .build();
        var save = categoryRepository.save(category);
        return new CategoryResponse(save.getId(), save.getName());
    }

    @Override
    public void deleteCategory(Long id) {
        var category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(CATEGORY_NOT_FOUND));
        category.setActive(false);
        categoryRepository.save(category);
    }

    @Override
    public CategoryResponse getCategory(Long id) {
        var category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(CATEGORY_NOT_FOUND));
        return new CategoryResponse(category.getId(), category.getName());
    }

    @Override
    public CategoryResponse updateCategory(CategoryRequest categoryRequest, Long id) throws BadRequestUserException {
        var category = categoryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(CATEGORY_NOT_FOUND));
        if (categoryRequest == null || categoryRequest.name().isEmpty()) {
            throw new BadRequestUserException("Vui lòng nhập tên danh mục");
        }
        category.setName(categoryRequest.name());
        categoryRepository.save(category);
        return new CategoryResponse(id, categoryRequest.name());
    }
}
