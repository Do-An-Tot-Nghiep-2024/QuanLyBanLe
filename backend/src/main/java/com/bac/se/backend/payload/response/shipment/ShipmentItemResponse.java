package com.bac.se.backend.payload.response.shipment;

import com.bac.se.backend.payload.response.product.ProductShipmentResponse;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

public record ShipmentItemResponse(
        String name,
        BigDecimal total,
        List<ProductShipmentResponse> productItems,
        Date createdAt
) {
}
