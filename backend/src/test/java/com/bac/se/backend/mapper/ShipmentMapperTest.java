package com.bac.se.backend.mapper;

import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class ShipmentMapperTest {

    private final ShipmentMapper shipmentMapper = new ShipmentMapper();
    @Test
    void mapToShipmentItemResponse() {
        Object[] mockObj = new Object[]{"1", "Supplier", "Banh bao",
                new Date(System.currentTimeMillis()),
                new Date(System.currentTimeMillis()), 1, 3, "cai"};
        var response = shipmentMapper.mapToShipmentItemResponse(mockObj);
        assertNotNull(response);
        assertEquals(1, response.shipmentId());
        assertEquals("Supplier", response.supplier());
        assertEquals("Banh bao", response.product());
        assertEquals(mockObj[3], response.mxp());
        assertEquals(mockObj[4], response.exp());
        assertEquals(1, response.soldQuantity());
        assertEquals(3, response.availableQuantity());
        assertEquals("cai", response.unit());

    }
}