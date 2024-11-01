package com.bac.se.backend.payload.request.promotion;

public record GiftPromotionRequest(
        PromotionRequest promotionRequest,
        Integer buyQuantity,
        Integer giftQuantity,
        Long productId,
        Long giftProductId,
        Long giftShipmentId
) {
}
