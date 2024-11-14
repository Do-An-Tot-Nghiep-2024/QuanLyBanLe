package com.bac.se.backend.mapper;

import com.bac.se.backend.payload.response.product.ProductPriceResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class ProductPriceMapperTest {

    @InjectMocks
    private ProductPriceMapper productPriceMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void mapObjectToProductPriceResponse() {
        Object[] objectProductPrice = new Object[]{"1","100.00", "200.00"};
        ProductPriceMapper productPriceMapper = new ProductPriceMapper();
        ProductPriceResponse productPriceResponse = productPriceMapper.mapObjectToProductPriceResponse(objectProductPrice);
        assertNotNull(productPriceResponse);
        assertEquals(100.00, productPriceResponse.originalPrice());
        assertEquals(200.00, productPriceResponse.price());
    }


}