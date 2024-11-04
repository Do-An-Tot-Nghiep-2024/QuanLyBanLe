package com.bac.se.backend.payload.request.promotion;

public record DiscountProductPromotionRequest(
        PromotionRequest promotionRequest,
        Long productId,
        Double discount
        ) {
}
