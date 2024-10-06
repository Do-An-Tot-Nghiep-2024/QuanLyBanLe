package com.bac.se.backend.controllers;

import com.bac.se.backend.exceptions.AlreadyExistsException;
import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.payload.request.CategoryRequest;
import com.bac.se.backend.payload.response.CategoryResponse;
import com.bac.se.backend.payload.response.common.ApiResponse;
import com.bac.se.backend.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;
    static final String REQUEST_SUCCESS = "success";


    @GetMapping
    @PreAuthorize("hasAuthority('MANAGER')")
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
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategory(@PathVariable("id") final Long id) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS,
                    categoryService.getCategory(id)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@RequestBody final CategoryRequest categoryRequest) {
        try {
            var response = categoryService.createCategory(categoryRequest);
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, response));
        } catch (BadRequestUserException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<Long>> deleteCategory(@PathVariable("id") final Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, id));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(@RequestBody CategoryRequest categoryRequest,
                                                                        @PathVariable("id") Long id) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS,
                    categoryService.updateCategory(categoryRequest, id)));
        } catch (BadRequestUserException e) {
            return ResponseEntity.status(400)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}
