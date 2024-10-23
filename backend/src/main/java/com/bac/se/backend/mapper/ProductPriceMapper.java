package com.bac.se.backend.mapper;

import com.bac.se.backend.models.ProductPrice;
import com.bac.se.backend.payload.response.product.ProductPriceResponse;
import com.bac.se.backend.payload.response.product.StatisticPriceProductResponse;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class ProductPriceMapper {
    // map object to product price
    public ProductPriceResponse mapObjectToProductPriceResponse(Object[] objectProductPrice) {
        return new ProductPriceResponse(
                Double.parseDouble(objectProductPrice[0].toString()),
                Double.parseDouble(objectProductPrice[1].toString()),
                Double.parseDouble(objectProductPrice[2].toString())
        );
    }

    public ProductPriceResponse mapToProductPriceResponse(ProductPrice productPrice) {
        return new ProductPriceResponse(
                productPrice.getOriginalPrice(),
                productPrice.getPrice(),
                productPrice.getDiscountPrice()
        );
    }

    public StatisticPriceProductResponse mapObjectToStatisticsProductPrice(Object[] objectStatisticPriceProduct) {
        return new StatisticPriceProductResponse(
                Double.parseDouble(objectStatisticPriceProduct[0].toString()),
                Double.parseDouble(objectStatisticPriceProduct[1].toString()),
                (Date) objectStatisticPriceProduct[2]
        );
    }
}
