package com.bac.se.backend.payload.request.promotion;

public record DiscountProductPromotion(
        PromotionRequest promotionRequest,
        Long productId,
        Double discount
        ) {
}
