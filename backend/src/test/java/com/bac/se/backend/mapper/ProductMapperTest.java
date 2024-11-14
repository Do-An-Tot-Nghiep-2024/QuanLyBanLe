package com.bac.se.backend.mapper;

import com.bac.se.backend.payload.response.product.ProductResponse;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ProductMapperTest {

    private final ProductMapper productMapper = new ProductMapper();

    @Test
    void mapObjectToProductResponse() {
        ProductResponse productResponse = productMapper.mapObjectToProductResponse(new Object[]{"1", "name", "image", "category","unit", "200", "300"}, new ArrayList<>());
        assertEquals(1L, productResponse.getId());
        assertEquals("name", productResponse.getName());
        assertEquals("image", productResponse.getImage());
        assertEquals("category", productResponse.getCategory());
        assertEquals(200.0, productResponse.getPrice());
        assertEquals("unit", productResponse.getUnit());
    }
}