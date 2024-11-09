package com.bac.se.backend.controllers;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.payload.request.CreateProductRequest;
import com.bac.se.backend.payload.request.ProductPriceRequest;
import com.bac.se.backend.payload.request.ProductUpdateRequest;
import com.bac.se.backend.payload.response.common.ApiResponse;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.product.*;
import com.bac.se.backend.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/products")
public class ProductController {
    private final ProductService productService;
    static final String REQUEST_SUCCESS = "success";

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getProducts(
            @RequestParam(name = "pageNumber", defaultValue = "0") Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, productService.getProducts(pageNumber, pageSize)));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable("id") Long id) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, productService.getProductById(id)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @PostMapping(consumes = "multipart/form-data")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<CreateProductResponse>> createProduct(
            @RequestPart("productRequest") CreateProductRequest createProductRequest,
            @RequestPart("file") MultipartFile filePath) {
        try {
            System.out.println( "product request :" + createProductRequest);
            System.out.println("file path is : " +  filePath);
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS,
                    productService.createProduct(createProductRequest, filePath)));
        } catch (BadRequestUserException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<Long>> deleteProduct(@PathVariable("id") Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, id));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @RequestPart("productRequest") ProductUpdateRequest productUpdateRequest,
            @PathVariable("id") Long id,
            @RequestPart("file") MultipartFile filePath) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, productService.updateProduct(id, productUpdateRequest, filePath)));
        } catch (BadRequestUserException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @PutMapping("/{id}/price")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<ProductPriceResponse>> updatePriceProduct(
            @RequestBody ProductPriceRequest productPriceRequest,
            @PathVariable("id") Long id) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, productService.updatePriceProduct(id, productPriceRequest)));
        } catch (BadRequestUserException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }


    @GetMapping("/supplier/{id}")
    public ResponseEntity<ApiResponse<List<ProductQueryResponse>>> getProductsBySupplier(@PathVariable("id") Long supplierId){
        try{
            return ResponseEntity.ok()
                    .body(new ApiResponse<>(REQUEST_SUCCESS,productService.getProductsBySupplier(supplierId)));
        }catch (Exception e){
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/category/{id}")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProductsByCategory(@PathVariable("id") Long categoryId){
        try{
            return ResponseEntity.ok()
                    .body(new ApiResponse<>(REQUEST_SUCCESS,productService.getProductsByCategory(categoryId)));
        }catch (Exception e){
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }


    @GetMapping("/mobile")
    public ResponseEntity<ApiResponse<PageResponse<ProductMobileResponse>>> getProductsMobile(
            @RequestParam(name = "pageNumber", defaultValue = "0") Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, productService.getProductsMobile(pageNumber, pageSize)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/mobile/category/{id}")
    public ResponseEntity<ApiResponse<PageResponse<ProductMobileResponse>>> getProductsMobileByCategory(
            @PathVariable("id") Long categoryId,
            @RequestParam(name = "pageNumber", defaultValue = "0") Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, productService.getProductsMobileByCategory(categoryId, pageNumber, pageSize)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}
