package com.bac.se.backend.controllers;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.payload.response.ApiResponse;
import com.bac.se.backend.payload.response.CategoryResponse;
import com.bac.se.backend.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;
    static final String REQUEST_SUCCESS = "success";

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategories() {
        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS,
                    categoryService.getCategories()));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategory(@PathVariable("id") Long id) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS,
                    categoryService.getCategory(id)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@RequestBody String categoryName) {
        try {
            var response = categoryService.createCategory(categoryName);
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, response));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Long>> deleteCategory(@PathVariable("id") Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, id));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(@RequestBody String categoryName,
                                                                        @PathVariable("id") Long id) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS,
                    categoryService.updateCategory(categoryName, id)));
        } catch (BadRequestUserException e) {
            return ResponseEntity.status(400)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}
