package com.bac.se.backend.payload.response.order;

public record StockOrderResponse(
        Long stockId,
        int quantity
) {
}
