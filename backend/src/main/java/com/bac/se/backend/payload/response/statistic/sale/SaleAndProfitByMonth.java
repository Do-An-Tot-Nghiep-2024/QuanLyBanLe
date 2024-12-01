package com.bac.se.backend.payload.response.statistic.sale;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SaleAndProfitByMonth{
        String week;
        BigDecimal totalSales;
        BigDecimal totalProfit;

}
