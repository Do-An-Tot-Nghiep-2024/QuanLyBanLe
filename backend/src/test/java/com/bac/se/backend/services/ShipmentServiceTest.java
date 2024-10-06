package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.mapper.ProductPriceMapper;
import com.bac.se.backend.models.*;
import com.bac.se.backend.payload.request.ProductItem;
import com.bac.se.backend.payload.request.ShipmentRequest;
import com.bac.se.backend.payload.response.ShipmentResponse;
import com.bac.se.backend.payload.response.product.ProductPriceResponse;
import com.bac.se.backend.repositories.*;
import com.bac.se.backend.services.impl.ShipmentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class ShipmentServiceTest {
    @InjectMocks
    private ShipmentServiceImpl shipmentService;
    @Mock
    private StockRepository stockRepository;
    @Mock
    private ShipmentRepository shipmentRepository;
    @Mock
    private ShipmentItemRepository shipmentItemRepository;
    @Mock
    private ProductPriceRepository productPriceRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private ProductPriceMapper productPriceMapper;

    static final double DEFAULT_PROFIT = 0.2;
    static final String PRODUCT_NOT_FOUND = "Không tìm thấy sản phẩm";
    static final String STOCK_NOT_FOUND = "Không tìm thấy lô hàng của sản phẩm";

    Shipment shipment = null;
    ProductItem productItem = null;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        shipment = Shipment.builder().createdAt(new Date()).build();
        productItem = mock(ProductItem.class);
    }

    @Test
    void createShipment() {
        ShipmentRequest shipmentRequest = mock(ShipmentRequest.class);
        setupCommonMocks(shipmentRequest);

        Product product = mock(Product.class);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        List<Object[]> productPrice = new LinkedList<>();
        Object[] objects = new Object[]{1000, 1500, 30};
        productPrice.add(objects);
        when(productPriceRepository.getProductPriceLatest(eq(1L), any(PageRequest.class))).thenReturn(productPrice);
        when(productPriceMapper.mapObjectToProductPriceResponse(productPrice.get(0))).thenReturn(new ProductPriceResponse(1200, 1700, 30));
        double oldPrice = productPriceMapper.mapObjectToProductPriceResponse(productPrice.get(0)).price();
        ProductPrice newProductPrice = ProductPrice.builder()
                .product(Product.builder().id(productItem.id()).build())
                .originalPrice(productItem.price())
                .price(productItem.price() + productItem.price() * DEFAULT_PROFIT)
                .discountPrice(0)
                .createdAt(new Date())
                .build();
        when(productPriceRepository.save(any(ProductPrice.class))).thenReturn(newProductPrice);

        Stock stock = mock(Stock.class);
        when(stockRepository.findStockByProductId(1L)).thenReturn(Optional.of(stock));

        // Act
        ShipmentResponse response = shipmentService.createShipment(shipmentRequest);

        // Assert
        assertNotNull(response);
        assertEquals(shipmentRequest.name(), response.name());
        assertEquals(BigDecimal.valueOf(1000.0), response.total());
        assertNotEquals(oldPrice, productItem.price());
        verify(shipmentRepository, times(1)).save(any(Shipment.class));
        verify(shipmentItemRepository, times(1)).save(any(ShipmentItem.class));
        verify(stockRepository, times(1)).save(any(Stock.class));
        verify(productPriceRepository, times(1)).save(any(ProductPrice.class));
    }

    @Test
    void testCreateShipmentWithProductException() {
        ShipmentRequest shipmentRequest = mock(ShipmentRequest.class);
        setupCommonMocks(shipmentRequest);
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        ResourceNotFoundException resourceNotFoundException = assertThrows(ResourceNotFoundException.class,
                () -> shipmentService.createShipment(shipmentRequest));
        assertEquals(PRODUCT_NOT_FOUND, resourceNotFoundException.getMessage());

        verify(productRepository).findById(1L);
        verify(productPriceRepository, never()).getProductPriceLatest(any(Long.class), any(PageRequest.class));
        verify(productPriceMapper, never()).mapObjectToProductPriceResponse(any(Object[].class));
        verify(productPriceRepository, never()).save(any(ProductPrice.class));
        verify(shipmentItemRepository, never()).save(any(ShipmentItem.class));
        verify(stockRepository, never()).save(any(Stock.class));
    }

    @Test
    void testCreateShipmentWithStockException() {
        ShipmentRequest shipmentRequest = mock(ShipmentRequest.class);
        setupCommonMocks(shipmentRequest);

        Product product = mock(Product.class);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        List<Object[]> productPrice = new LinkedList<>();
        Object[] objects = new Object[]{1000, 1500, 30};
        productPrice.add(objects);
        when(productPriceRepository.getProductPriceLatest(eq(1L), any(PageRequest.class))).thenReturn(productPrice);
        when(productPriceMapper.mapObjectToProductPriceResponse(productPrice.get(0))).thenReturn(new ProductPriceResponse(1200, 1700, 30));

        when(stockRepository.findStockByProductId(1L)).thenReturn(Optional.empty());

        ResourceNotFoundException resourceNotFoundException = assertThrows(ResourceNotFoundException.class,
                () -> shipmentService.createShipment(shipmentRequest));
        assertEquals(STOCK_NOT_FOUND, resourceNotFoundException.getMessage());

        verify(productRepository, times(1)).findById(1L);
        verify(stockRepository).findStockByProductId(1L);
        verify(productPriceRepository, times(1)).getProductPriceLatest(any(Long.class), any(PageRequest.class));
        verify(productPriceMapper, times(1)).mapObjectToProductPriceResponse(any(Object[].class));
        verify(shipmentItemRepository, times(1)).save(any(ShipmentItem.class));
        verify(stockRepository, never()).save(any(Stock.class));
    }

    private void setupCommonMocks(ShipmentRequest shipmentRequest) {
        when(shipmentRepository.save(any(Shipment.class))).thenReturn(shipment);
        ProductItem productItem = mock(ProductItem.class);
        when(productItem.id()).thenReturn(1L);
        when(productItem.quantity()).thenReturn(10);
        when(productItem.price()).thenReturn(100.0);
        when(shipmentRequest.productItems()).thenReturn(List.of(productItem));
    }


}