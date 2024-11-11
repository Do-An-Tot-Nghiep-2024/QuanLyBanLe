package com.bac.se.backend.payload.response.shipment;

import java.util.Date;

public record ShipmentResponse(
        String id,
        String supplier,
        Date importDate
) {
}
