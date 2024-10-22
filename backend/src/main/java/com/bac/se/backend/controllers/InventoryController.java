package com.bac.se.backend.controllers;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.payload.request.ShipmentRequest;
import com.bac.se.backend.payload.response.common.ApiResponse;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.invoice.ImportInvoice;
import com.bac.se.backend.payload.response.shipment.ShipmentItemResponse;
import com.bac.se.backend.payload.response.shipment.ShipmentResponse;
import com.bac.se.backend.services.ShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {
    private final ShipmentService shipmentService;
    final String REQUEST_SUCCESS = "success";

    @PostMapping("/import")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<ShipmentResponse>> createImportInvoice(@RequestBody ShipmentRequest shipmentRequest) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, shipmentService.createShipment(shipmentRequest)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }catch (BadRequestUserException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<PageResponse<ImportInvoice>>> getImportInvoices(
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS,
                    shipmentService.getImportInvoices(pageNumber, pageSize)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<ShipmentItemResponse>> getShipmentItem(@PathVariable("id") Long id) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS,
                    shipmentService.getShipment(id)
            ));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}
