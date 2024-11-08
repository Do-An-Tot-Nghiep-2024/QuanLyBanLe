package com.bac.se.backend.payload.response.promotion;

public record CreatePromotionResponse(
        String name,
        String description,
        String startDate,
        String endDate,
        Long promotionTypeId
) {
}
