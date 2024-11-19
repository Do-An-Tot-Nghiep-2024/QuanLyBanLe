package com.bac.se.backend.services.impl;

import com.bac.se.backend.payload.response.DashboardResponse;
import com.bac.se.backend.services.DashboardService;
import com.bac.se.backend.services.StatisticService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final StatisticService statisticService;

    @Override
    public DashboardResponse getDashboard() {
        long currentTotalOrders = statisticService.getCurrentTotalOrders();
        BigDecimal currentTotalSales = statisticService.getCurrentTotalSales();
        BigDecimal currentNetTotalProfit = statisticService.getCurrentNetTotalProfit();
        return new DashboardResponse(
                currentTotalOrders,
                currentTotalSales,
                currentNetTotalProfit
        );
    }
}
