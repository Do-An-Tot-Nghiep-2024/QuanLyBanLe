package com.bac.se.backend.payload.request.promotion;

import java.math.BigDecimal;

public record OrderPromotionRequest(
        PromotionRequest promotionRequest,
        BigDecimal minOrderValue,
        Double discountPercent
) {
}
