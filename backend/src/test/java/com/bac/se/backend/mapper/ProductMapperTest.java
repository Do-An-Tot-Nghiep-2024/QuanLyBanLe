package com.bac.se.backend.mapper;

import com.bac.se.backend.payload.response.product.ProductResponse;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ProductMapperTest {

    private ProductMapper productMapper = new ProductMapper();

    @Test
    void mapObjectToProductResponse() {
        ProductResponse productResponse = productMapper.mapObjectToProductResponse(new Object[]{"1", "name", "image", "category", "supplier", "100", "200", "300"}, new ArrayList<>());
        assertEquals(1L, productResponse.id());
        assertEquals("name", productResponse.name());
        assertEquals("image", productResponse.image());
        assertEquals("category", productResponse.category());
        assertEquals("supplier", productResponse.supplier());
        assertEquals(100.0, productResponse.originalPrice());
        assertEquals(200.0, productResponse.price());
        assertEquals(300.0, productResponse.discountPrice());
    }
}