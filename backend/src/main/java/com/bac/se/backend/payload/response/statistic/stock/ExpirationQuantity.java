package com.bac.se.backend.payload.response.statistic.stock;

public record ExpirationQuantity(
        String name,
        String exp,
        Long shipment,
        Integer avb
) {
}
