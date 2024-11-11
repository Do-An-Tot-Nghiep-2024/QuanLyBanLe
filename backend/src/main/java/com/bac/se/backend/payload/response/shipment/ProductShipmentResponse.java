package com.bac.se.backend.payload.response.shipment;

import java.util.Date;

public record ProductShipmentResponse(
        Long shipmentId,
        String supplier,
        String productName,
        Date mxp,
        Date exp,
        double price,
        int soldQuantity,
        int failedQuantity,
        int availableQuantity,
        String unit
) {
}
