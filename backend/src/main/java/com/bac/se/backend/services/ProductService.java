package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.payload.request.CreateProductRequest;
import com.bac.se.backend.payload.request.ProductPriceRequest;
import com.bac.se.backend.payload.request.ProductUpdateRequest;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.product.CreateProductResponse;
import com.bac.se.backend.payload.response.product.ProductPriceResponse;
import com.bac.se.backend.payload.response.product.ProductResponse;
import com.bac.se.backend.payload.response.product.ProductSupplierResponse;
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

    List<ProductSupplierResponse> getProductsBySupplier(Long supplierId);
}
