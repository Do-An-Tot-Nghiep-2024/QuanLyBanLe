package com.bac.se.backend.payload.response.statistic;

import java.math.BigDecimal;

public record DashboardResponse(long currentTotalOrders,
                                BigDecimal currentTotalSales,
                                BigDecimal currentNetTotalProfit
                                ) {
}
