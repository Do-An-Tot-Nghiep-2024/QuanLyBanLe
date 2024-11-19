package com.bac.se.backend.payload.request;

import com.bac.se.backend.payload.request.product.ProductItem;

import java.util.List;

public record ShipmentRequest(
        Long supplierId,
        List<ProductItem> productItems) {
}
