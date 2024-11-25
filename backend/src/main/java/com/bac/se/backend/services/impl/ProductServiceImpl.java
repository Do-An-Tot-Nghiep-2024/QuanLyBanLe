package com.bac.se.backend.services.impl;

import com.bac.se.backend.enums.PageLimit;
import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.mapper.ProductMapper;
import com.bac.se.backend.mapper.PromotionMapper;
import com.bac.se.backend.models.*;
import com.bac.se.backend.payload.request.CreateProductRequest;
import com.bac.se.backend.payload.request.product.ProductPriceRequest;
import com.bac.se.backend.payload.request.product.ProductUpdateRequest;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.product.*;
import com.bac.se.backend.repositories.*;
import com.bac.se.backend.services.ProductPriceService;
import com.bac.se.backend.services.ProductService;
import com.bac.se.backend.utils.UploadImage;
import jakarta.transaction.Transactional;
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
    private final ProductPriceService productPriceService;
    private final ShipmentItemRepository shipmentItemRepository;
    static final String NOT_FOUND_PRODUCT = "Không tìm thấy sản phẩm";
    private final UploadImage uploadImage;
    private final UnitRepository unitRepository;
    private final StockRepository stockRepository;
    private final PromotionMapper promotionMapper;

    // validate product input
    private void validateInput(ProductUpdateRequest productUpdateRequest) throws BadRequestUserException {
        String name = productUpdateRequest.name();
        Long categoryId = productUpdateRequest.categoryId();
        Long supplierId = productUpdateRequest.supplierId();
        if (name.isEmpty() || categoryId == null || supplierId == null) {
            throw new BadRequestUserException("Vui lòng nhập đầy đủ thông tin");
        }
    }

    // get all product with pagination
    @Override
    public PageResponse<ProductResponse> getProducts(
            String productName,String category,
            Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Object[]> productPage = productRepository.getProducts(productName,category,pageable);
        List<Object[]> productList = productPage.getContent();
        List<Long> productIds = productList.stream().map(x -> Long.parseLong(x[0].toString())).toList();
        Map<Long, List<Long>> shipmentItemMap = new HashMap<>();
        for (Long productId : productIds) {
            List<Long> shipmentIds = shipmentItemRepository.getShipmentItemByProduct(productId).stream()
                    .map(x -> Long.parseLong(x[0].toString())).toList();

            shipmentItemMap.put(productId, shipmentIds);
        }
        List<ProductResponse> productResponseList = productList.stream()
                .map(res -> {
                    Long productId = Long.parseLong(res[0].toString());
                    List<Long> shipmentItemIds = shipmentItemMap.getOrDefault(productId, Collections.emptyList());
                    return productMapper.mapObjectToProductResponse(res, shipmentItemIds);
                }).toList();
        return new PageResponse<>(productResponseList, pageNumber,
                productPage.getTotalPages(), productPage.getTotalElements(), productPage.isLast());
    }

    // get product by id
    @Override
    public ProductResponse getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException(NOT_FOUND_PRODUCT));
        var productPriceResponse = productPriceService.getPriceLatest(productId);
        List<Long> shipmentIds = new ArrayList<>();
        List<Object[]> shipmentItems = shipmentItemRepository.getShipmentItemByProduct(productId);
        if (!shipmentItems.isEmpty()) {
            shipmentIds = shipmentItems.stream().map(x -> Long.parseLong(x[0].toString())).toList();
        }
        return new ProductResponse(product.getId(),
                product.getName(), product.getImage(),
                product.getCategory().getName(),
                product.getUnit().getName(),
                productPriceResponse.price(),
                productPriceResponse.originalPrice(),
                shipmentIds);
    }


    // create product
    @Override
    @Transactional
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
        Unit unit = unitRepository.findById(productUpdateRequest.unitId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn vị tính"));
        Product product = Product.builder()
                .name(productUpdateRequest.name())
                .image(imageURL)
                .category(category)
                .supplier(supplier)
                .unit(unit)
                .isActive(true)
                .build();
        var productSave = productRepository.save(product);
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
        var productPriceResponse = productPriceService.getPriceLatest(productId);

        // Update basic product information
        product.setName(productUpdateRequest.name());
        product.setCategory(category);
        product.setSupplier(supplier);
        product.setImage(imageURL);
        productRepository.save(product);
        return createProductResponse(product, productPriceResponse);
    }

    @Override
    public ProductPriceResponse updatePriceProduct(Long productId, ProductPriceRequest request) throws BadRequestUserException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException(NOT_FOUND_PRODUCT));
        var priceLatest = productPriceService.getPriceLatest(productId);
        if (request.price() == null) {
            throw new BadRequestUserException("Vui lòng nhập đẩy đủ thông tin");
        }
        if (request.price() <= 0) {
            throw new BadRequestUserException("Giá không được nhỏ hơn 0");
        }
        if(request.price() < priceLatest.originalPrice()){
            throw new BadRequestUserException("Giá bán không được nhỏ hơn giá gốc là " + priceLatest.originalPrice());
        }
        // cập nhật giá mới trong db
        ProductPrice productPrice = ProductPrice.builder()
                .product(product)
                .originalPrice(priceLatest.originalPrice())
                .price(request.price())
                .createdAt(new Date())
                .build();
        var save = productPriceService.createProductPrice(productPrice);
        return new ProductPriceResponse(save.getId(), productPrice.getOriginalPrice(), productPrice.getPrice());
    }

    @Override
    public List<ProductQueryResponse> getProductsBySupplier(Long supplierId) {
        List<Object[]> productList = productRepository.getProductsBySupplier(supplierId);
        return productList.stream()
                .map(p -> new ProductQueryResponse(
                        Long.parseLong(p[0].toString()),
                        p[1].toString(),
                        p[2].toString()
                )).toList();
    }

    @Override
    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        List<Object[]> productList = productRepository.getProductsByCategory(categoryId);
        List<Long> productIds = productList.stream().map(x -> Long.parseLong(x[0].toString())).toList();
        Map<Long, List<Long>> shipmentItemMap = new HashMap<>();
        for (Long productId : productIds) {
            List<Long> shipmentIds = shipmentItemRepository.getShipmentItemByProduct(productId).stream()
                    .map(x -> Long.parseLong(x[0].toString())).toList();

            shipmentItemMap.put(productId, shipmentIds);
        }
        return productList.stream()
                .map(res -> {
                    Long productId = Long.parseLong(res[0].toString());
                    List<Long> shipmentItemIds = shipmentItemMap.getOrDefault(productId, Collections.emptyList());
                    return productMapper.mapObjectToProductResponse(res, shipmentItemIds);
                }).toList();
    }

    @Override
    public PageResponse<ProductMobileResponse> getProductsMobile(Integer pageNumber, Integer pageSize) {
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);
        var productsMobile = productRepository.getProductsMobile(pageRequest);
        var mobileResponses = productsMobile.getContent()
                .stream()
                .map(productMapper::mapObjectToProductMobileResponse).toList();

        for (ProductMobileResponse productMobileResponse : mobileResponses) {
            var maxAvailableQuantityStock = stockRepository
                    .getMaxAvailableQuantityStock(productMobileResponse.getProductId(),
                            PageLimit.ONLY.getPageable());
            if (!maxAvailableQuantityStock.isEmpty()) {
                productMobileResponse.setShipmentId(Long.parseLong(maxAvailableQuantityStock.get(0)[0].toString()));

            }
        }
        return new PageResponse<>(mobileResponses, pageNumber,
                productsMobile.getTotalPages(), productsMobile.getTotalElements(), productsMobile.isLast());
    }

    @Override
    public PageResponse<ProductMobileResponse> getProductsMobileByCategory(Long categoryId, Integer pageNumber, Integer pageSize) {
        var productsMobile = productRepository.getProductsMobileByCategory(categoryId, PageLimit.DEFAULT.getPageable());
        var mobileResponses = productsMobile.getContent()
                .stream()
                .map(productMapper::mapObjectToProductMobileResponse).toList();
        for (ProductMobileResponse productMobileResponse : mobileResponses) {
            var maxAvailableQuantityStock = stockRepository
                    .getMaxAvailableQuantityStock(productMobileResponse.getProductId(),
                            PageLimit.ONLY.getPageable());
            if (!maxAvailableQuantityStock.isEmpty()) {
                productMobileResponse.setShipmentId(Long.parseLong(maxAvailableQuantityStock.get(0)[0].toString()));
            }
        }
        return new PageResponse<>(mobileResponses, pageNumber,
                productsMobile.getTotalPages(), productsMobile.getTotalElements(), productsMobile.isLast());
    }

    @Override
    public List<ProductResponse> getProductsByName(String name) {
        List<Object[]> productList = productRepository.getProductsByName(name, PageLimit.DEFAULT.getPageable());
        log.info("productList size : {} ", productList.size());
        if (productList.isEmpty()) {
            return List.of();
        }
        List<Long> productIds = productList.stream().map(x -> Long.parseLong(x[0].toString())).toList();
        Map<Long, List<Long>> shipmentItemMap = new HashMap<>();
        for (Long productId : productIds) {
            List<Long> shipmentIds = shipmentItemRepository.getShipmentItemByProduct(productId).stream()
                    .map(x -> Long.parseLong(x[0].toString())).toList();

            shipmentItemMap.put(productId, shipmentIds);
        }
        return productList.stream()
                .map(res -> {
                    Long productId = Long.parseLong(res[0].toString());
                    List<Long> shipmentItemIds = shipmentItemMap.getOrDefault(productId, Collections.emptyList());
                    if(!shipmentItemIds.isEmpty()){
                        return productMapper.mapObjectToProductResponse(res, shipmentItemIds);
                    }
                    return null;
                })
                .filter(Objects::nonNull)
                .toList();
    }

    // Helper method to create ProductResponse
    private ProductResponse createProductResponse(Product product, ProductPriceResponse productPrice) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getImage(),
                product.getCategory().getName(),
                product.getUnit().getName(),
                productPrice.price(),
                productPrice.originalPrice(),
                null
        );
    }


}
