package com.bac.se.backend.payload.response.shipment;

import java.util.Date;

public record ProductShipmentResponse(
        Long shipmentId,
        String supplier,
        String product,
        Date mxp,
        Date exp,
        int soldQuantity,
        int availableQuantity,
        String unit
) {
}
