package com.bac.se.backend.payload.request;

import java.util.List;

public record ShipmentRequest(
        String name,
        List<ProductItem> productItems) {
}
