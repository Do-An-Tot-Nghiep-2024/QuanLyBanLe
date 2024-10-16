package com.bac.se.backend.controllers;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.payload.request.OrderRequest;
import com.bac.se.backend.payload.response.DateRequest;
import com.bac.se.backend.payload.response.common.ApiResponse;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.order.CreateOrderResponse;
import com.bac.se.backend.payload.response.order.OrderCustomerResponse;
import com.bac.se.backend.payload.response.order.OrderResponse;
import com.bac.se.backend.services.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    static final String REQUEST_SUCCESS = "success";

    @PostMapping("/live")
    public ResponseEntity<ApiResponse<CreateOrderResponse>> createOrderLive(@RequestBody OrderRequest orderRequest, HttpServletRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(REQUEST_SUCCESS, orderService.createOrderLive(orderRequest, request)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (BadRequestUserException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/customer/{id}")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getOrderByCustomer(
            @PathVariable("id") Long id,
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, orderService.getOrdersByCustomer(id, pageNumber, pageSize)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/employee/{id}")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getOrdersByEmployee(
            @PathVariable("id") Long id,
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, orderService.getOrdersByEmployee(id, pageNumber, pageSize)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/employee/{id}/date")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getOrdersEmployeeFromDate(
            @PathVariable("id") Long id,
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestBody DateRequest dateRequest
    ) {
        System.out.println(dateRequest);
        try {

            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, orderService.getOrdersEmployeeByDate(id, pageNumber, pageSize, dateRequest.fromDate(), dateRequest.toDate())));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/customer-detail/{orderId}")
    public ResponseEntity<ApiResponse<OrderCustomerResponse>> getOrderCustomerDetail(@PathVariable("orderId") Long orderId) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, orderService.getOrderDetailByCustomer(orderId)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}
