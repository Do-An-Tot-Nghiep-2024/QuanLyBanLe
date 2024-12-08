package com.bac.se.backend.payload.request.shipment;

public record UpdateDiscountProductShipment(
        Long productId,
        Long shipmentId,
        double discount
) {
}
