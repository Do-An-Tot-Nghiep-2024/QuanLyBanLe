package com.bac.se.backend.mapper;

import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class PromotionMapperTest {

    private final PromotionMapper promotionMapper = new PromotionMapper();

    @Test
    void mapToPromotionResponse() {
        Object[] mockObj = new Object[]{"1", "Khuyen mai giam gia", "Khuyen mai",
                new Date(System.currentTimeMillis()),
                new Date(System.currentTimeMillis()),
                10, 100.00, 0.05};
        var response = promotionMapper.mapToPromotionResponse(mockObj);
        assertNotNull(response);
        assertEquals(1, response.id());
        assertEquals("Khuyen mai giam gia", response.name());
        assertEquals("Khuyen mai", response.description());
        assertEquals(mockObj[3], response.startDate());
        assertEquals(mockObj[4], response.endDate());
        assertEquals(10, response.orderLimit());
        assertEquals(100.00, response.minOrderPrice());
        assertEquals(0.05, response.percentage());
    }

    @Test
    void mapToLatestPromotionResponse() {
        Object[] mockObj = new Object[]{"1", "100.00", "0.05", 10, new Date(System.currentTimeMillis())};
        var response = promotionMapper.mapToLatestPromotionResponse(mockObj);
        assertNotNull(response);
        assertEquals(1, response.id());
        assertEquals(100.00, response.minOrderValue());
        assertEquals(0.05, response.percentage());
        assertEquals(10, response.orderLimit());
        assertEquals(mockObj[4], response.endDate());
    }
}