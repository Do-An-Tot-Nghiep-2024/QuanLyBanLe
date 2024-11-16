package com.bac.se.backend.mapper;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class InvoiceMapperTest {

    @Test
    void mapObjectToImportInvoice() {
        Object[] mockObj = new Object[]{"1", "Supplier", "2022-01-01", "100"};
        var response = new InvoiceMapper().mapObjectToImportInvoice(mockObj);
        assertNotNull(response);
        assertEquals("HDNH-1", response.numberInvoice());
        assertEquals("Supplier", response.name());
        assertEquals("2022-01-01", response.createdAt());
        assertEquals(BigDecimal.valueOf(100F), response.total());
    }
}