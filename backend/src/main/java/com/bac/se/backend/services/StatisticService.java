package com.bac.se.backend.services;

import com.bac.se.backend.payload.response.common.OrderDateResponse;
import com.bac.se.backend.payload.response.product.StatisticPriceProductResponse;
import com.bac.se.backend.payload.response.statistic.SaleAndProfitResponse;
import com.bac.se.backend.payload.response.statistic.StatisticResponse;
import com.bac.se.backend.payload.response.statistic.product.BestSellingProductResponse;
import com.bac.se.backend.payload.response.statistic.product.TopFiveHighestGrossingProductResponse;
import com.bac.se.backend.payload.response.statistic.sale.SaleAndProfitByMonth;
import com.bac.se.backend.payload.response.statistic.stock.ProductStockResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.math.BigDecimal;
import java.text.ParseException;
import java.util.List;

public interface StatisticService {
    List<StatisticResponse> salesStatisticsByProduct();

    List<StatisticResponse> salesStatisticsByEmployee();

    List<StatisticPriceProductResponse> statisticsProductPriceByTime(Long productId);

    // for employee
    List<OrderDateResponse<BigDecimal>> getTotalSalesByEmp(HttpServletRequest request,
                                                           String fromDate, String toDate) throws ParseException;

    List<OrderDateResponse<Integer>> getCurrentTotalOrdersOfEmployee(HttpServletRequest request,
                                                                     String fromDate, String toDate) throws ParseException;
    // for manager

    BigDecimal getCurrentTotalSales();

    Long getCurrentTotalOrders();

    BigDecimal getCurrentNetTotalProfit();

    // statistics by date

    // sale and profit
    List<SaleAndProfitResponse> getSalesAndProfitInWeek(String toDate) throws ParseException;

    // best selling product
    List<BestSellingProductResponse> statisticsBestSellingProduct(String fromDate, String toDate) throws ParseException;

    // top five highest grossing product
    List<TopFiveHighestGrossingProductResponse> statisticsTopFiveHighestGrossingProduct(String fromDate, String toDate) throws ParseException;

    // statistics by supplier
    List<StatisticResponse> statisticsBySupplier();

    //  sales and profit by month
    List<SaleAndProfitByMonth> getSalesAndProfitByMonth(Integer month);


    List<ProductStockResponse> getStockByProduct(Integer month);


}
