package com.bac.se.backend.payload.response.promotion;

import java.math.BigDecimal;

public record OrderPromotionResponse(
        Long promotionId,
        BigDecimal minOrderValue,
        Double discountPercent
) {
}
