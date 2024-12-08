package com.bac.se.backend.mapper;

import com.bac.se.backend.payload.response.order.StockOrderResponse;
import com.bac.se.backend.payload.response.statistic.stock.AvailableQuantity;
import com.bac.se.backend.payload.response.statistic.stock.ExpirationQuantity;
import com.bac.se.backend.payload.response.statistic.stock.ImportQuantity;
import com.bac.se.backend.payload.response.statistic.stock.SoldQuantity;
import com.bac.se.backend.payload.response.stock.StockResponse;
import org.springframework.stereotype.Service;

@Service
public class StockMapper {
    public StockResponse mapObjectToStockResponse(Object[] obj) {
        return new StockResponse(
                Long.parseLong(obj[0].toString()),
                Integer.parseInt(obj[1].toString()),
                Integer.parseInt(obj[2].toString()),
                Integer.parseInt(obj[3].toString())
        );
    }
    public StockOrderResponse mapObjectToStockOrderResponse(Object[] obj) {
        return new StockOrderResponse(
                Long.parseLong(obj[0].toString()),
                Integer.parseInt(obj[1].toString())
        );
    }


    public SoldQuantity mapToSoldQuantity(Object[] obj) {
        return new SoldQuantity(
                Long.parseLong(obj[0].toString()),
                obj[1].toString(),
                Integer.parseInt(obj[2].toString())
        );
    }
    public AvailableQuantity mapToAvailableQuantity(Object[] obj) {
        return new AvailableQuantity(
                Long.parseLong(obj[0].toString()),
                Integer.parseInt(obj[1].toString())
        );
    }

    public ImportQuantity mapToImportQuantity(Object[] obj) {
        return new ImportQuantity(
                Long.parseLong(obj[0].toString()),
                Integer.parseInt(obj[1].toString())
        );
    }

    public ExpirationQuantity mapToExpirationQuantity(Object[] obj) {
        return new ExpirationQuantity(
                Long.parseLong(obj[0].toString()),
                obj[1].toString(),
                obj[2].toString(),
                Long.parseLong(obj[3].toString()),
                Integer.parseInt(obj[4].toString()),
                Double.parseDouble(obj[5].toString())
        );
    }
}
