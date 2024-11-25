package com.bac.se.backend.payload.response.statistic;

import java.math.BigDecimal;

public record DashboardEmpResponse(
        long currentTotalOrders,
        BigDecimal currentTotalSales
) {
}
