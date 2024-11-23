package com.bac.se.backend.payload.response.statistic.product;

import java.math.BigDecimal;

public record TopFiveHighestGrossingProductResponse(
        String name,
        BigDecimal total
) {
}
