package com.bac.se.backend.services.impl;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.mapper.ProductMapper;
import com.bac.se.backend.mapper.ProductPriceMapper;
import com.bac.se.backend.models.*;
import com.bac.se.backend.payload.request.CreateProductRequest;
import com.bac.se.backend.payload.request.ProductUpdateRequest;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.product.CreateProductResponse;
import com.bac.se.backend.payload.response.product.ProductPriceResponse;
import com.bac.se.backend.payload.response.product.ProductResponse;
import com.bac.se.backend.repositories.*;
import com.bac.se.backend.services.ProductService;
import com.bac.se.backend.utils.UploadImage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final ProductPriceRepository productPriceRepository;
    private final ProductPriceMapper productPriceMapper;
    private final StockRepository stockRepository;
    private final ShipmentItemRepository shipmentItemRepository;
    static final String NOT_FOUND_PRODUCT = "Không tìm thấy sản phẩm";
    private final UploadImage uploadImage;

    // validate product input
    private void validateInput(ProductUpdateRequest productUpdateRequest) throws BadRequestUserException {
        String name = productUpdateRequest.name();
        Long categoryId = productUpdateRequest.categoryId();
        Long supplierId = productUpdateRequest.supplierId();
        double price = productUpdateRequest.price();
        double originalPrice = productUpdateRequest.originalPrice();
        if (name.isEmpty() || categoryId == null || supplierId == null) {
            throw new BadRequestUserException("Vui lòng nhập đầy đủ thông tin");
        }
        if (price <= 0 || originalPrice <= 0) {
            throw new BadRequestUserException("Giá phải lớn hơn 0");
        }
        if (originalPrice > price) {
            throw new BadRequestUserException("Giá nhập lớn hơn giá gốc");
        }
    }

    // get all product with pagination
    @Override
    public PageResponse<ProductResponse> getProducts(Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Object[]> productPage = productRepository.getProducts(pageable);
        List<Object[]> productList = productPage.getContent();
        List<Long> productIds = productList.stream().map(x -> Long.parseLong(x[0].toString())).toList();
        Map<Long, List<Long>> shipmentItemMap = new HashMap<>();
        for (Long productId : productIds) {
            List<Long> shipmentIds = shipmentItemRepository.getShipmentItemByProduct(productId).stream()
                    .map(x -> Long.parseLong(x[0].toString())).toList();
            shipmentItemMap.put(productId, shipmentIds);
        }
        List<ProductResponse> employeeResponseList = productList.stream()
                .map(res -> {
                    List<Long> shipmentItemIds = shipmentItemMap.getOrDefault(Long.parseLong(res[0].toString()), Collections.emptyList());
                    return productMapper.mapObjectToProductResponse(res, shipmentItemIds);
                }).toList();
        return new PageResponse<>(employeeResponseList, pageNumber,
                productPage.getTotalPages(), productPage.getTotalElements(), productPage.isLast());
    }

    // get product by id
    @Override
    public ProductResponse getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException(NOT_FOUND_PRODUCT));
        var productPriceResponse = getProductPriceResponse(productId);
        List<Long> shipmentIds = new ArrayList<>();
        List<Object[]> shipmentItems = shipmentItemRepository.getShipmentItemByProduct(productId);
        if (!shipmentItems.isEmpty()) {
            shipmentIds = shipmentItems.stream().map(x -> Long.parseLong(x[0].toString())).toList();
        }
//        System.out.println(shipmentItems.size());
        return new ProductResponse(product.getId(),
                product.getName(), product.getImage(),
                product.getCategory().getName(),
                product.getSupplier().getName(),
                productPriceResponse.originalPrice(),
                productPriceResponse.price(),
                productPriceResponse.discountPrice(),
                shipmentIds);
    }


    // create product
    @Override
    public CreateProductResponse createProduct(
            CreateProductRequest productUpdateRequest,
            MultipartFile image
    ) throws BadRequestUserException {
        if (productUpdateRequest.name().isEmpty() || productUpdateRequest.categoryId() == null || productUpdateRequest.supplierId() == null) {
            throw new BadRequestUserException("Vui lòng nhập đầy đủ thông tin");
        }
        // create image url and upload image to cloud storage
        var imageURL = uploadImage.uploadFile(image);

        Category category = categoryRepository.findById(productUpdateRequest.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục"));
        Supplier supplier = supplierRepository.findById(productUpdateRequest.supplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà cung cấp"));
        Product product = Product.builder()
                .name(productUpdateRequest.name())
                .image(imageURL)
                .category(category)
                .supplier(supplier)
                .isActive(true)
                .build();
        var productSave = productRepository.save(product);
        // Tạo lô hàng cho sản phẩm
        Stock stock = Stock.builder()
                .product(productSave)
                .build();
        stockRepository.save(stock);
        return new CreateProductResponse(productSave.getId(),
                productSave.getName(), productSave.getImage(),
                productSave.getCategory().getName(),
                productSave.getSupplier().getName());

    }

    // delete product by id
    @Override
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException(NOT_FOUND_PRODUCT));
        product.setActive(false);
        productRepository.save(product);
    }


    // update product by id and input
    @Override
    public ProductResponse updateProduct(Long productId, ProductUpdateRequest productUpdateRequest, MultipartFile image) throws BadRequestUserException {
        // Validate input once
        validateInput(productUpdateRequest);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new BadRequestUserException(NOT_FOUND_PRODUCT));
        String imageURL = product.getImage();
        if (image.getSize() > 0) {
            imageURL = uploadImage.uploadFile(image);
        }
        // Retrieve the product, category, and supplier efficiently

        Category category = categoryRepository.findById(productUpdateRequest.categoryId())
                .orElseThrow(() -> new BadRequestUserException("Không tìm thấy danh mục"));

        Supplier supplier = supplierRepository.findById(productUpdateRequest.supplierId())
                .orElseThrow(() -> new BadRequestUserException("Không tìm thấy nhà cung cấp"));

        // Get the latest product price
        var productPriceResponse = getProductPriceResponse(productId);

        // Update basic product information
        product.setName(productUpdateRequest.name());
        product.setCategory(category);
        product.setSupplier(supplier);
        product.setImage(imageURL);
        // Compare original prices, add new price if necessary
        if (productUpdateRequest.originalPrice() != productPriceResponse.originalPrice()) {
            ProductPrice newProductPrice = ProductPrice.builder()
                    .originalPrice(productUpdateRequest.originalPrice())
                    .discountPrice(0)
                    .price(productUpdateRequest.price())
                    .createdAt(new Date())
                    .build();
            productPriceRepository.save(newProductPrice);  // Save the new product price
            productRepository.save(product);  // Update the product after saving the new price
            var productPriceConvert = productPriceMapper.mapToProductPriceResponse(newProductPrice);
            // Return response with new price
            return createProductResponse(product, productPriceConvert);
        }

        // Return response with existing price
        return createProductResponse(product, productPriceResponse);
    }

    // Helper method to create ProductResponse
    private ProductResponse createProductResponse(Product product, ProductPriceResponse productPrice) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getImage(),
                product.getCategory().getName(),
                product.getSupplier().getName(),
                productPrice.originalPrice(),
                productPrice.price(),
                productPrice.discountPrice(),
                null
        );
    }

    private ProductPriceResponse getProductPriceResponse(Long productId) {
        var productPriceLatest = productPriceRepository.getProductPriceLatest(productId, PageRequest.of(0, 1));
        if (productPriceLatest.isEmpty()) {
            return new ProductPriceResponse(0, 0, 0);
        }
        return productPriceMapper.mapObjectToProductPriceResponse(productPriceLatest.get(0));
    }
}
