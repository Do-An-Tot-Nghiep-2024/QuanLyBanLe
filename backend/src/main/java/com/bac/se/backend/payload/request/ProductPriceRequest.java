package com.bac.se.backend.payload.request;

public record ProductPriceRequest(
        Double originalPrice,
        Double price
) {
}
