package com.bac.se.backend.mapper;

import com.bac.se.backend.payload.response.SupplierResponse;
import org.springframework.stereotype.Service;

@Service
public class SupplierMapper {
    public SupplierResponse mapObjectToSupplierResponse(Object[] supplier) {
        return new SupplierResponse(
                Long.valueOf(supplier[0].toString()), // id
                (String) supplier[1],                   // name
                (String) supplier[2],                   // phone
                (String) supplier[3],                   // email
                (String) supplier[4]                    // address
        );
    }
}
