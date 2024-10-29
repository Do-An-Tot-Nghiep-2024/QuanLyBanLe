package com.bac.se.backend.payload.response.product;

import java.util.Date;

public record ProductShipmentResponse(
        String name,
        int quantity,
        int soldQuantity,
        int failedQuantity,
        int availableQuantity,
        Date mxp,
        Date exp,
        double price,
        double total,
        String unit
) {
}
