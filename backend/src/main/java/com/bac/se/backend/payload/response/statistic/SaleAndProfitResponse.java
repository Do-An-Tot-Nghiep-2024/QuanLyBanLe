package com.bac.se.backend.payload.response.statistic;

import java.math.BigDecimal;

public record SaleAndProfitResponse(
        String date,
        BigDecimal totalSales,
        BigDecimal totalProfit
) {
}
