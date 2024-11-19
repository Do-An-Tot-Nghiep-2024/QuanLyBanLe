package com.bac.se.backend.payload.response.shipment;

import com.bac.se.backend.payload.request.product.ProductItem;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

public record CreateShipmentResponse(String name,
                                     BigDecimal total,
                                     List<ProductItem> productItems,
                                     Date createdAt) {
}
