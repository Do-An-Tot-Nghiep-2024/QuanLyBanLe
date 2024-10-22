package com.bac.se.backend.payload.response.product;

import java.util.Date;

public record ProductShipmentResponse(
        String name,
        int quantity,
        Date mxp,
        Date exp,
        double price,
        double total
) {
}
