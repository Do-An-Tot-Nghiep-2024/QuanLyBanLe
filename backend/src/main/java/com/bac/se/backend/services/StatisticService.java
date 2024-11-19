package com.bac.se.backend.services;

import com.bac.se.backend.payload.response.product.BestSellingProductResponse;
import com.bac.se.backend.payload.response.product.StatisticPriceProductResponse;
import com.bac.se.backend.payload.response.statistic.StatisticResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.math.BigDecimal;
import java.text.ParseException;
import java.util.List;

public interface StatisticService {
    List<StatisticResponse> salesStatisticsByProduct();

    List<StatisticResponse> salesStatisticsByEmployee();

    List<StatisticPriceProductResponse> statisticsProductPriceByTime(Long productId);

    List<BestSellingProductResponse> statisticsBestSellingProduct(String fromDate, String toDate) throws ParseException;


    BigDecimal getSalesCurrentOfEmployee(HttpServletRequest request);

    // for manager
    BigDecimal getCurrentTotalSales();

    Long getCurrentTotalOrders();

    BigDecimal getCurrentNetTotalProfit();





}
