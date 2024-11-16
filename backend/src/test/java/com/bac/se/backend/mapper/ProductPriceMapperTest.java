package com.bac.se.backend.mapper;

import com.bac.se.backend.payload.response.product.ProductPriceResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class ProductPriceMapperTest {

    @InjectMocks
    private ProductPriceMapper productPriceMapper;

    @BeforeEach
    void setUp() {
        productPriceMapper = new ProductPriceMapper();
    }

    @Test
    void mapObjectToProductPriceResponse() {
        Object[] objectProductPrice = new Object[]{"1", "100.00", "200.00"};
        ProductPriceResponse productPriceResponse = productPriceMapper.mapObjectToProductPriceResponse(objectProductPrice);
        assertNotNull(productPriceResponse);
        assertEquals(100.00, productPriceResponse.originalPrice());
        assertEquals(200.00, productPriceResponse.price());
    }

    @Test
    void mapObjectToStatisticsProductPrice() {
        Object[] mockObj = new Object[]{"100.00", "200.00", new Date(System.currentTimeMillis())};
        var response = productPriceMapper.mapObjectToStatisticsProductPrice(mockObj);
        assertNotNull(response);
        assertEquals(100.00, response.originalPrice());
        assertEquals(200.00, response.price());
        assertEquals(mockObj[2], response.createdAt());
    }


}