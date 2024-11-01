package com.bac.se.backend.mapper;

import com.bac.se.backend.payload.response.stock.StockResponse;
import org.springframework.stereotype.Service;

@Service
public class StockMapper {
    public StockResponse mapObjectToStockResponse(Object[] obj) {
        return new StockResponse(
                Long.parseLong(obj[0].toString()),
                Integer.parseInt(obj[1].toString()),
                Integer.parseInt(obj[2].toString())
        );
    }
}
