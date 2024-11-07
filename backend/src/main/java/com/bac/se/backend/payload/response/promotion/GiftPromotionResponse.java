package com.bac.se.backend.payload.response.promotion;

public record GiftPromotionResponse(
        Integer buyQuantity,
        Integer giftQuantity,
        String giftProductName
) {
}
