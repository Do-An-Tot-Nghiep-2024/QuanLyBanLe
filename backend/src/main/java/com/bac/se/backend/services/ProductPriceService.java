package com.bac.se.backend.services;

import com.bac.se.backend.models.ProductPrice;
import com.bac.se.backend.payload.response.product.ProductPriceResponse;

public interface ProductPriceService {
    ProductPriceResponse getPriceLatest(Long productId);

    ProductPrice createProductPrice(ProductPrice productPrice);

    ProductPrice getProductPriceById(Long productPriceId);
}
