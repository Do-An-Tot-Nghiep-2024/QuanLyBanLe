package com.bac.se.backend.payload.request;

import java.util.List;

public record ShipmentRequest(
        Long supplierId,
        List<ProductItem> productItems) {
}
