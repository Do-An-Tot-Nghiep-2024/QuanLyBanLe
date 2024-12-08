package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.payload.request.ShipmentRequest;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.invoice.ImportInvoice;
import com.bac.se.backend.payload.response.invoice.ImportInvoiceItemResponse;
import com.bac.se.backend.payload.response.shipment.CreateShipmentResponse;
import com.bac.se.backend.payload.response.shipment.ProductShipmentResponse;

import java.text.ParseException;
import java.util.List;


public interface ShipmentService {
    // create unit test for code above
    CreateShipmentResponse createShipment(ShipmentRequest shipmentRequest) throws BadRequestUserException;


    List<ProductShipmentResponse> getShipments();



    PageResponse<ImportInvoice> getImportInvoices(Integer pageNumber, Integer pageSize,
                                                  String fromDate,
                                                  String toDate) throws ParseException;

    ImportInvoiceItemResponse getItemImportInvoice(Long id);


    String updateDiscountProductForShipment(Long shipmentId, Long productId,
                                            double discount) throws BadRequestUserException;

}
