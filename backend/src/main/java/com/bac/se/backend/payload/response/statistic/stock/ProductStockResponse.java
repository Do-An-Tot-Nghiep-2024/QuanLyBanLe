package com.bac.se.backend.payload.response.statistic.stock;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductStockResponse {
    String name;
    int soldQuantity;
    int importQuantity;
    int availableQuantity;

}
