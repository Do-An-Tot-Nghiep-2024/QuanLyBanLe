package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.AlreadyExistsException;
import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.models.Category;
import com.bac.se.backend.payload.request.CategoryRequest;
import com.bac.se.backend.payload.response.CategoryResponse;
import com.bac.se.backend.repositories.CategoryRepository;
import com.bac.se.backend.services.impl.CategoryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CategoryServiceTest {


    @InjectMocks
    private CategoryServiceImpl categoryService;
    @Mock
    private CategoryRepository categoryRepository;


    Long categoryId = 1L;
    Category category;
    @BeforeEach
    void setUp() {

        MockitoAnnotations.openMocks(this);
        category = Category.builder()
                .id(categoryId)
                .name("New Category")
                .isActive(true)
                .build();
    }



    @Test
    void getCategoriesSuccess() {
        List<Object[]> categoryList = new LinkedList<>();
        Object[] category = new Object[]{categoryId, "New Category"};
        categoryList.add(category);
        when(categoryRepository.getCategories()).thenReturn(categoryList);
        // Act
        List<CategoryResponse> response = categoryService.getCategories();
        // Assert
        assertNotNull(response);
        assertEquals(1, response.size());
        assertEquals(categoryId, response.get(0).id());
        assertEquals("New Category", response.get(0).name());
        verify(categoryRepository, times(1)).getCategories();
    }


    @Test
    void createCategorySuccess() throws BadRequestUserException {
        CategoryRequest categoryRequest = new CategoryRequest("New Category");
        when(categoryRepository.save(any(Category.class))).thenReturn(category);
        // Act
        CategoryResponse response = categoryService.createCategory(categoryRequest);
        // Assert
        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals("New Category", response.name());
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void createCategoryExistName() {
        CategoryRequest request = new CategoryRequest("Electronics");
        when(categoryRepository.existsByName(request.name())).thenReturn(true);

        // Act & Assert
        AlreadyExistsException thrown = assertThrows(AlreadyExistsException.class, () -> {
            categoryService.createCategory(request);
        });

        assertEquals("Danh mục đã tồn tại", thrown.getMessage());
        verify(categoryRepository, times(1)).existsByName(request.name());
        verify(categoryRepository, never()).save(any(Category.class));
    }

    @Test
    void createCategoryFail() {
        // Arrange
        CategoryRequest categoryRequest = new CategoryRequest("");
        // Act & Assert
        BadRequestUserException exception = assertThrows(BadRequestUserException.class,
                () -> categoryService.createCategory(categoryRequest));
        assertEquals("Vui lòng nhập tên danh mục", exception.getMessage());
        verify(categoryRepository, never()).save(any(Category.class));
    }

    @Test
    void deleteCategorySuccess() {
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        categoryService.deleteCategory(categoryId);
        assertFalse(category.isActive());
        verify(categoryRepository, times(1)).findById(categoryId);  // Verify findById is called
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void deleteCategoryFail() {
        Long categoryId = 1L;
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.empty());
        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> categoryService.deleteCategory(categoryId));
        assertEquals("Không tìm thấy danh mục", exception.getMessage());
        verify(categoryRepository, times(1)).findById(categoryId);  // Verify findById is called
        verify(categoryRepository, never()).save(any(Category.class));
    }


    @Test
    void getCategorySuccess() {
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        // Act
        CategoryResponse response = categoryService.getCategory(categoryId);
        // Assert
        assertNotNull(response);
        assertEquals(categoryId, response.id());
        assertEquals("New Category", response.name());
        verify(categoryRepository, times(1)).findById(categoryId);
    }

    @Test
    void getCategoryFail() {
        // Arrange
        Long categoryId = 1L;
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.empty());
        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> categoryService.getCategory(categoryId));
        assertEquals("Không tìm thấy danh mục", exception.getMessage());
        verify(categoryRepository, times(1)).findById(categoryId);
        verify(categoryRepository, never()).save(any(Category.class));
    }

    @Test
    void updateCategorySuccess() throws BadRequestUserException {
        Long categoryId = 1L;
        CategoryRequest categoryRequest = new CategoryRequest("Updated Category");

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        when(categoryRepository.save(category)).thenReturn(category);
        // Act
        CategoryResponse response = categoryService.updateCategory(categoryRequest, categoryId);
        // Assert
        assertNotNull(response);
        assertEquals(categoryId, response.id());
        assertEquals("Updated Category", response.name());
        verify(categoryRepository, times(1)).findById(categoryId);
        verify(categoryRepository, times(1)).save(category);
    }

    @Test
    void updateCategoryNotFound() {
        CategoryRequest categoryRequest = new CategoryRequest("Updated Category");

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> categoryService.updateCategory(categoryRequest, categoryId));

        assertEquals("Không tìm thấy danh mục", exception.getMessage());
        verify(categoryRepository, times(1)).findById(categoryId);
        verify(categoryRepository, never()).save(any(Category.class));
    }

    @Test
    void updateCategoryInvalidInput() {
        Long categoryId = 1L;
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        CategoryRequest categoryRequest = new CategoryRequest("");  // Empty name to trigger exception

        // Act & Assert
        BadRequestUserException exception = assertThrows(BadRequestUserException.class,
                () -> categoryService.updateCategory(categoryRequest, categoryId));

        assertEquals("Vui lòng nhập tên danh mục", exception.getMessage());
        verify(categoryRepository, times(1)).findById(anyLong());
        verify(categoryRepository, never()).save(any(Category.class));
    }


}