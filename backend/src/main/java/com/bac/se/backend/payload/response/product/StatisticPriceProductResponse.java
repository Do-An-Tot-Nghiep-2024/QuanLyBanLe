package com.bac.se.backend.payload.response.product;

import java.util.Date;

public record StatisticPriceProductResponse(
        double originalPrice,
        double price,
        Date createdAt
) {
}
