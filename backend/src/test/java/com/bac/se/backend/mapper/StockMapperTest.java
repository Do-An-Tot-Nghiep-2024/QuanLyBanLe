package com.bac.se.backend.mapper;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class StockMapperTest {

    private final StockMapper stockMapper = new StockMapper();
    @Test
    void mapObjectToStockResponse() {
        Object[] mockObj = new Object[]{"1", "30", "10", "5"};
        var response = stockMapper.mapObjectToStockResponse(mockObj);
        assertNotNull(response);
        assertEquals(1, response.id());
        assertEquals(30, response.quantity());
        assertEquals(10, response.soldQuantity());
        assertEquals(5, response.notifyQuantity());
    }
}