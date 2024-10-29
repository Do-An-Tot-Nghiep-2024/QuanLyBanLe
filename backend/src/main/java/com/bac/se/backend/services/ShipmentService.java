package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.payload.request.ShipmentRequest;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.invoice.ImportInvoice;
import com.bac.se.backend.payload.response.shipment.ShipmentItemResponse;
import com.bac.se.backend.payload.response.shipment.ShipmentResponse;

import java.text.ParseException;


public interface ShipmentService {
    // create unit test for code above
    ShipmentResponse createShipment(ShipmentRequest shipmentRequest) throws BadRequestUserException;

    // create order shipment
//    PageResponse<ImportInvoice> getImportInvoices(Integer pageNumber, Integer pageSize,
//                                                  Date fromDate,
//                                                  Date toDate) throws ParseException;


    PageResponse<ImportInvoice> getImportInvoices(Integer pageNumber, Integer pageSize,
                                                  String fromDate,
                                                  String toDate) throws ParseException;

    ShipmentItemResponse getShipment(Long id);

}
