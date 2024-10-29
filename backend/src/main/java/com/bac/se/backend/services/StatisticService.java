package com.bac.se.backend.services;

import com.bac.se.backend.payload.response.product.BestSellingProductResponse;
import com.bac.se.backend.payload.response.product.StatisticPriceProductResponse;
import com.bac.se.backend.payload.response.statistic.StatisticResponse;

import java.text.ParseException;
import java.util.List;

public interface StatisticService {
    List<StatisticResponse> salesStatisticsByProduct();

    List<StatisticResponse> salesStatisticsByEmployee();

    List<StatisticPriceProductResponse> statisticsProductPriceByTime(Long productId);

    List<BestSellingProductResponse> statisticsBestSellingProduct(String fromDate, String toDate) throws ParseException;

}
