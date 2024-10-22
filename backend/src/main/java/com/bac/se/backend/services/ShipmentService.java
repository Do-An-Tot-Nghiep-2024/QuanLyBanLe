package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.payload.request.ShipmentRequest;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.invoice.ImportInvoice;
import com.bac.se.backend.payload.response.shipment.ShipmentItemResponse;
import com.bac.se.backend.payload.response.shipment.ShipmentResponse;


public interface ShipmentService {
    ShipmentResponse createShipment(ShipmentRequest shipmentRequest) throws BadRequestUserException;
    // create unit test for code above

        // create order shipment
    PageResponse<ImportInvoice> getImportInvoices(Integer pageNumber, Integer pageSize);

    ShipmentItemResponse getShipment(Long id);

}
