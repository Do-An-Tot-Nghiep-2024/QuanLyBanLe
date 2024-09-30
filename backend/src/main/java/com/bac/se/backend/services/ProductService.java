package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.mapper.ProductMapper;
import com.bac.se.backend.models.Category;
import com.bac.se.backend.models.Product;
import com.bac.se.backend.models.ProductPrice;
import com.bac.se.backend.models.Supplier;
import com.bac.se.backend.payload.request.ProductRequest;
import com.bac.se.backend.payload.response.PageResponse;
import com.bac.se.backend.payload.response.ProductResponse;
import com.bac.se.backend.repositories.CategoryRepository;
import com.bac.se.backend.repositories.ProductPriceRepository;
import com.bac.se.backend.repositories.ProductRepository;
import com.bac.se.backend.repositories.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final ProductPriceRepository productPriceRepository;
    static final String NOT_FOUND_PRODUCT = "Không tìm thấy sản phẩm";

    // validate product input
    private void validateInput(ProductRequest productRequest) throws BadRequestUserException {
        String name = productRequest.name();
        String image = productRequest.image();
        Long categoryId = productRequest.categoryId();
        Long supplierId = productRequest.supplierId();
        double price = productRequest.price();
        double originalPrice = productRequest.originalPrice();
        if (name.isEmpty() || image.isEmpty() || categoryId == null || supplierId == null) {
            throw new BadRequestUserException("Vui lòng nhập đầy đủ thông tin");
        }
        if (price <= 0 || originalPrice <= 0) {
            throw new BadRequestUserException("Giá phải lớn hơn 0");
        }
    }

    public PageResponse<ProductResponse> getEmployees(Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Object[]> productPage = productRepository.getProducts(pageable);
        List<Object[]> productList = productPage.getContent();
        List<ProductResponse> employeeResponseList = productList.stream()
                .map(productMapper::mapObjectToProductResponse)
                .toList();
        return new PageResponse<>(employeeResponseList, pageNumber,
                productPage.getTotalPages(), productPage.getTotalElements(), productPage.isLast());
    }

    // get product by id
    public ProductResponse getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException(NOT_FOUND_PRODUCT));
        return new ProductResponse(product.getId(),
                product.getName(), product.getImage(),
                product.getCategory().getName(),
                product.getSupplier().getName(),
                product.getProductPrice().getOriginalPrice(),
                product.getProductPrice().getPrice(),
                product.getProductPrice().getDiscountPrice());
    }


    // create product
    public ProductResponse createProduct(ProductRequest productRequest) throws BadRequestUserException {
        validateInput(productRequest);
        Category category = categoryRepository.findById(productRequest.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục"));
        Supplier supplier = supplierRepository.findById(productRequest.supplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà cung cấp"));
        ProductPrice productPrice = ProductPrice.builder()
                .originalPrice(productRequest.originalPrice())
                .discountPrice(0)
                .price(productRequest.price())
                .createdAt(new Date())
                .build();
        var productPriceSave = productPriceRepository.save(productPrice);
        Product product = Product.builder()
                .name(productRequest.name())
                .image(productRequest.image())
                .category(category)
                .supplier(supplier)
                .productPrice(productPriceSave)
                .isActive(true)
                .build();
        var productSave = productRepository.save(product);
        return new ProductResponse(productSave.getId(),
                productSave.getName(), productSave.getImage(),
                productSave.getCategory().getName(),
                productSave.getSupplier().getName(),
                productPrice.getOriginalPrice(),
                productPrice.getPrice(),
                productSave.getProductPrice().getDiscountPrice());
    }

    // delete product by id
    public void deleteProduct(Long productId)  {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException(NOT_FOUND_PRODUCT));
        product.setActive(false);
        productRepository.save(product);
    }


    // update product by id and input
    public ProductResponse updateProduct(Long productId, ProductRequest productRequest) throws BadRequestUserException {
        validateInput(productRequest);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new BadRequestUserException(NOT_FOUND_PRODUCT));
        validateInput(productRequest);
        product.setName(productRequest.name());
        product.setImage(productRequest.image());
        product.setCategory(categoryRepository.findById(productRequest.categoryId())
                .orElseThrow(() -> new BadRequestUserException("Không tìm thấy danh mục")));
        product.setSupplier(supplierRepository.findById(productRequest.supplierId())
                .orElseThrow(() -> new BadRequestUserException("Không tìm thấy nhà cung cấp")));
        ProductPrice productPrice = ProductPrice.builder()
                .originalPrice(productRequest.originalPrice())
                .discountPrice(0)
                .price(productRequest.price())
                .createdAt(new Date())
                .build();
        var productPriceSave = productPriceRepository.save(productPrice);
        product.setProductPrice(productPriceSave);
        productRepository.save(product);
        return new ProductResponse(product.getId(),
                product.getName(), product.getImage(),
                product.getCategory().getName(),
                product.getSupplier().getName(),
                productPrice.getOriginalPrice(),
                productPrice.getPrice(),
                product.getProductPrice().getDiscountPrice());
    }

}
