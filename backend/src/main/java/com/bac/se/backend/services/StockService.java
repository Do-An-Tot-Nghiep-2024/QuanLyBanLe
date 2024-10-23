package com.bac.se.backend.services;

import com.bac.se.backend.payload.response.StockResponse;
import com.bac.se.backend.payload.response.common.PageResponse;

public interface StockService {
    PageResponse<StockResponse> getStocksByProduct(Integer page, Integer size);
}
