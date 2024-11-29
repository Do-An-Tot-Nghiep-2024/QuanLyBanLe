package com.bac.se.backend.services.impl;

import com.bac.se.backend.payload.response.statistic.DashboardEmpResponse;
import com.bac.se.backend.payload.response.statistic.DashboardResponse;
import com.bac.se.backend.services.DashboardService;
import com.bac.se.backend.services.StatisticService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.ParseException;

@Slf4j
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

    @Override
    public DashboardEmpResponse getDashboardEmp(HttpServletRequest request, String fromDate, String toDate) throws ParseException {
        var totalOrders = statisticService.getCurrentTotalOrdersOfEmployee(request, fromDate, toDate)
                .stream()
//                .sorted(Collections.reverseOrder())
                .toList();
        log.info("total orders {}",totalOrders);
        long currentTotalOrders = 0L;
        if (!totalOrders.isEmpty()) {
            currentTotalOrders = totalOrders.get(0).getData();
        }

        var totalSales = statisticService.getTotalSalesByEmp(request, fromDate, toDate)
                .stream()
//                .sorted(Collections.reverseOrder())
                .toList();
        BigDecimal currTotalSales = BigDecimal.ZERO;
        if (!totalSales.isEmpty()) {
            currTotalSales = totalSales.get(0).getData();
        }
        return new DashboardEmpResponse(currentTotalOrders, currTotalSales);
    }


}
