package com.bac.se.backend.payload.response;

import com.bac.se.backend.payload.request.ProductItem;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

public record ShipmentResponse(String name,
                               BigDecimal total,
                               List<ProductItem> productItems,
                               Date createdAt) {
}
