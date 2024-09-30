package com.bac.se.backend.mapper;

import com.bac.se.backend.payload.response.SupplierResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class SupplierMapperTest {

    private final SupplierMapper supplierMapper = new SupplierMapper();
    @Test
    void mapObjectToSupplierResponse() {
        Object[] supplier = new Object[]{"1", "name", "phone", "email", "address"};
        SupplierResponse supplierResponse = supplierMapper.mapObjectToSupplierResponse(supplier);
        assertEquals(supplierResponse.id(), 1);
        assertEquals(supplierResponse.name(), "name");
        assertEquals(supplierResponse.phone(), "phone");
        assertEquals(supplierResponse.email(), "email");
        assertEquals(supplierResponse.address(), "address");
    }
}