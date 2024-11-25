package com.bac.se.backend.mapper;

import com.bac.se.backend.payload.response.common.OrderDateResponse;
import com.bac.se.backend.payload.response.statistic.SaleAndProfitResponse;
import com.bac.se.backend.payload.response.statistic.StatisticResponse;
import com.bac.se.backend.payload.response.statistic.product.TopFiveHighestGrossingProductResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;

@Service
public class StatisticMapper {

    public SaleAndProfitResponse mapObjectToSaleAndProfitResponse(Object[] object) {
        return new SaleAndProfitResponse(
                object[0].toString(),
                BigDecimal.valueOf(Double.parseDouble(object[1].toString())),
                BigDecimal.valueOf(Double.parseDouble(object[2].toString()))
        );
    }

    public TopFiveHighestGrossingProductResponse mapObjectToTopFiveHighestGrossingProduct(Object[] object) {
        return new TopFiveHighestGrossingProductResponse(
                object[0].toString(),
                BigDecimal.valueOf(Double.parseDouble(object[1].toString()))
        );
    }

    public StatisticResponse mapObjectToStatisticResponse(Object[] object) {
        return new StatisticResponse(
                object[0].toString(),
                BigDecimal.valueOf(Double.parseDouble(object[1].toString()))
        );
    }

    public OrderDateResponse<BigDecimal> mapObjectToTotalSalesResponse(Object[] object) {
        return new OrderDateResponse<>(
                (Date) object[0],
                BigDecimal.valueOf(Double.parseDouble(object[1].toString()))
        );
    }
    public OrderDateResponse<Integer> mapObjectToTotalOrdersResponse(Object[] object) {
        return new OrderDateResponse<>(
                (Date) object[0],
                Integer.parseInt(object[1].toString())
        );
    }
}
