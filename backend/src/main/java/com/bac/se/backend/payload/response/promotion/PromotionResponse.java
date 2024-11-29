package com.bac.se.backend.payload.response.promotion;

import java.util.Date;

public record PromotionResponse(
        Long id,
        String name,
        String description,
        Date startDate,
        Date endDate,
        int orderLimit,
        double minOrderValue,
        double percentage,
        boolean isActive
) {
}
