package com.bac.se.backend.payload.response.statistic;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SaleAndProfitResponse {
    String date;
    BigDecimal totalSales;
    BigDecimal totalProfit;
}
