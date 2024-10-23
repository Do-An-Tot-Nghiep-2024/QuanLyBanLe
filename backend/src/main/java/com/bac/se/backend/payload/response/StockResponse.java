package com.bac.se.backend.payload.response;

public record StockResponse(Long id, String name, int soldQuantity, int remainingQuantity) {
}
