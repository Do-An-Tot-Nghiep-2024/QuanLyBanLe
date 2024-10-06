package com.bac.se.backend.mapper;

import com.bac.se.backend.models.ProductPrice;
import com.bac.se.backend.payload.response.product.ProductPriceResponse;
import org.springframework.stereotype.Service;

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
}
