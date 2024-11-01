package com.bac.se.backend.payload.response.promotion;

public record PromotionResponse(
        String name,
        String description,
        String startDate,
        String endDate,
        Long promotionTypeId
) {
}
