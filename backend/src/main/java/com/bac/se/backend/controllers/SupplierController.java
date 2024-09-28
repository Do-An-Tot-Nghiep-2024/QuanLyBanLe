package com.bac.se.backend.controllers;

import com.bac.se.backend.exceptions.AlreadyExistsException;
import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.payload.request.SupplierRequest;
import com.bac.se.backend.payload.response.ApiResponse;
import com.bac.se.backend.services.SupplierService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/suppliers")
@RequiredArgsConstructor
public class SupplierController {
    private final SupplierService supplierService;
    static final String REQUEST_SUCCESS = "success";

    @GetMapping
    public ResponseEntity<ApiResponse> getSuppliers(
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize){
        try {
            return ResponseEntity
                    .ok(new ApiResponse(REQUEST_SUCCESS, supplierService.getSuppliers(pageNumber, pageSize)));
        }catch (Exception e){
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(e.getMessage(), null));
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getSupplier(@PathVariable("id") Long id){
        try {
            return ResponseEntity
                    .ok(new ApiResponse(REQUEST_SUCCESS, supplierService.getSupplier(id)));
        }catch (ResourceNotFoundException e){
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createSupplier(@RequestBody SupplierRequest supplierRequest){
        try {
            return ResponseEntity
                    .ok(new ApiResponse(REQUEST_SUCCESS, supplierService.createSupplier(supplierRequest)));
        }catch (BadRequestUserException e){
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), null));
        }catch (AlreadyExistsException e){
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new ApiResponse(e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteSupplier(@PathVariable("id") Long id){
        try {
            supplierService.deleteSupplier(id);
            return ResponseEntity
                    .ok(new ApiResponse(REQUEST_SUCCESS, null));
        }catch (ResourceNotFoundException e){
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateSupplier(@RequestBody SupplierRequest supplierRequest, @PathVariable("id") Long id){
        try {
            return ResponseEntity
                    .ok(new ApiResponse(REQUEST_SUCCESS, supplierService.updateSupplier(supplierRequest, id)));
        }catch (BadRequestUserException e){
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), null));
        }catch (AlreadyExistsException e){
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new ApiResponse(e.getMessage(), null));
        }
    }
}
