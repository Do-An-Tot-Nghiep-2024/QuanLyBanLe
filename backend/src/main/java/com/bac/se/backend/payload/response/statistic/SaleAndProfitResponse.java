package com.bac.se.backend.payload.response.statistic;

import java.math.BigDecimal;
import java.util.Date;

public record SaleAndProfitResponse(
        Date date,
        BigDecimal totalSales,
        BigDecimal totalProfit
) {
}
