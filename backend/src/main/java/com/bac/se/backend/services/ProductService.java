package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.payload.request.CreateProductRequest;
import com.bac.se.backend.payload.request.product.ProductPriceRequest;
import com.bac.se.backend.payload.request.product.ProductUpdateRequest;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.product.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


public interface ProductService {

    PageResponse<ProductResponse> getProducts(Integer pageNumber, Integer pageSize);

    ProductResponse getProductById(Long productId);

    CreateProductResponse createProduct(
            CreateProductRequest productUpdateRequest,
            MultipartFile image
    ) throws BadRequestUserException;


    void deleteProduct(Long productId);

    ProductResponse updateProduct(Long productId,
                                  ProductUpdateRequest productUpdateRequest,
                                  MultipartFile image) throws BadRequestUserException;

    ProductPriceResponse updatePriceProduct(Long productId, ProductPriceRequest request) throws BadRequestUserException;

    List<ProductQueryResponse> getProductsBySupplier(Long supplierId);

    List<ProductResponse> getProductsByCategory(Long categoryId);

    PageResponse<ProductMobileResponse> getProductsMobile(Integer pageNumber, Integer pageSize);

    PageResponse<ProductMobileResponse> getProductsMobileByCategory(Long categoryId, Integer pageNumber, Integer pageSize);

    List<ProductResponse> getProductsByName(String name);
}
