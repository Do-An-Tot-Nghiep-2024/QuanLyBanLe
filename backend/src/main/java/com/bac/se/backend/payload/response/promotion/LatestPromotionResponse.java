package com.bac.se.backend.payload.response.promotion;

import java.util.Date;

public record LatestPromotionResponse(
        Long id,
        double minOrderValue,
        double percentage,
        int orderLimit,
        Date endDate
) {
}
