package com.bac.se.backend.payload.response.shipment;

import java.util.List;

public record ShipmentItemResponse(
        Long shipmentId,
        List<ProductShipmentResponse> productShipmentResponses
) {
}
