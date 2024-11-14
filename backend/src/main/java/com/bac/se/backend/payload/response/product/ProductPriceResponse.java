package com.bac.se.backend.payload.response.product;

public record ProductPriceResponse(
        Long productPriceId,
        double originalPrice, double price
        ) {
}
