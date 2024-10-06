package com.bac.se.backend.controllers;

import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.payload.request.ShipmentRequest;
import com.bac.se.backend.payload.response.ShipmentResponse;
import com.bac.se.backend.payload.response.common.ApiResponse;
import com.bac.se.backend.services.ShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {
    private final ShipmentService shipmentService;

    @PostMapping("/import")
    public ResponseEntity<ApiResponse<ShipmentResponse>> createImportInvoice(@RequestBody ShipmentRequest shipmentRequest) {
        try {
            return ResponseEntity.ok(new ApiResponse<>("success",shipmentService.createShipment(shipmentRequest)));
        }catch (ResourceNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(),null));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(),null));
        }
    }
}
