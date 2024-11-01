package com.bac.se.backend.payload.request.promotion;

import java.util.Date;

public record PromotionRequest(
        String name,
        String description,
        Date startDate,
        Date endDate,
        Long promotionTypeId
) {
}
