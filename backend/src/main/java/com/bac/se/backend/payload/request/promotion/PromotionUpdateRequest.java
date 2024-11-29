package com.bac.se.backend.payload.request.promotion;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public record PromotionUpdateRequest(
        String name,
        String description,
        @JsonFormat(pattern = "yyyy-MM-dd")
        Date startDate,
        @JsonFormat(pattern = "yyyy-MM-dd")
        Date endDate,
        Integer orderLimit,
        Double minOrderValue,
        Double discountPercent,
        boolean isActive
) {
}
