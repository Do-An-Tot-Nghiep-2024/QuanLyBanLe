package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.payload.request.CategoryRequest;
import com.bac.se.backend.payload.response.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getCategories();
    CategoryResponse getCategory(Long id);
    CategoryResponse createCategory(CategoryRequest categoryRequest) throws BadRequestUserException;
    void deleteCategory(Long id);
    CategoryResponse updateCategory(CategoryRequest categoryRequest, Long id) throws BadRequestUserException;

}
