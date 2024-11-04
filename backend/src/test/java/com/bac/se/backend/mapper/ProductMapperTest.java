package com.bac.se.backend.mapper;

import com.bac.se.backend.payload.response.product.ProductResponse;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ProductMapperTest {

    private final ProductMapper productMapper = new ProductMapper();

    @Test
    void mapObjectToProductResponse() {
        ProductResponse productResponse = productMapper.mapObjectToProductResponse(new Object[]{"1", "name", "image", "category","unit","promotion",  "200", "300"}, new ArrayList<>());
        assertEquals(1L, productResponse.id());
        assertEquals("name", productResponse.name());
        assertEquals("image", productResponse.image());
        assertEquals("category", productResponse.category());
        assertEquals(200.0, productResponse.price());
        assertEquals(300.0, productResponse.discountPrice());
        assertEquals("unit", productResponse.unit());
    }
}