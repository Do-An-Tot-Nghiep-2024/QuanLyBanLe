package com.bac.se.backend.controllers;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.models.Category;
import com.bac.se.backend.payload.response.ApiResponse;
import com.bac.se.backend.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;
    static final String REQUEST_SUCCESS = "success";

    @PostMapping
    public ResponseEntity<ApiResponse> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(new ApiResponse(REQUEST_SUCCESS, category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteCategory(@PathVariable("id") Long id) {
        try {
            return ResponseEntity.ok(new ApiResponse(REQUEST_SUCCESS, id));
        }catch (ResourceNotFoundException e){
            return ResponseEntity.status(404)
                    .body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getCategory(@PathVariable("id") Long id) {
       try{
           return ResponseEntity.ok(new ApiResponse(REQUEST_SUCCESS,
                   categoryService.getCategory(id)));
       }catch (ResourceNotFoundException e){
           return ResponseEntity.status(404)
                   .body(new ApiResponse(e.getMessage(), null));
       }
    }

    @PutMapping
    public ResponseEntity<ApiResponse> updateCategory(@RequestBody Category category, @RequestBody Long id) {
        try{
            return ResponseEntity.ok(new ApiResponse(REQUEST_SUCCESS,
                    categoryService.updateCategory(category, id)));
        }catch (BadRequestUserException e) {
            return ResponseEntity.status(400)
                    .body(new ApiResponse(e.getMessage(), null));
        }catch (ResourceNotFoundException e){
            return ResponseEntity.status(404)
                    .body(new ApiResponse(e.getMessage(), null));
        }
    }
}
