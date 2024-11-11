package com.bac.se.backend.payload.response.stock;

public record StockResponse(Long id,Integer quantity,
                            Integer soldQuantity,Integer notifyQuantity) {
}
