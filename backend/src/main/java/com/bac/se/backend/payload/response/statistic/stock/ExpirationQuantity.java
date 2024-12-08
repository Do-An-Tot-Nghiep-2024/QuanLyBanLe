package com.bac.se.backend.payload.response.statistic.stock;

public record ExpirationQuantity(
        Long product,
        String name,
        String exp,
        Long shipment,
        Integer avb,
        double discount
) {
}
