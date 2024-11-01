package com.bac.se.backend.payload.request.promotion;

public record QuantityPromotionRequest(
        PromotionRequest promotionRequest,
        Integer buyQuantity,
        Integer freeQuantity,
        Long productId
) {
}
