package com.bac.se.backend.controllers;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.payload.request.OrderRequest;
import com.bac.se.backend.payload.response.common.ApiResponse;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.order.CreateOrderResponse;
import com.bac.se.backend.payload.response.order.OrderCustomerResponse;
import com.bac.se.backend.payload.response.order.OrderItemResponse;
import com.bac.se.backend.payload.response.order.OrderResponse;
import com.bac.se.backend.services.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    static final String REQUEST_SUCCESS = "success";



    @GetMapping
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getOrders(
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(defaultValue = "createdAt") String orderBy,
            @RequestParam(defaultValue = "DESC") String order,
            @RequestParam(defaultValue = "") String status,
            @RequestParam(defaultValue = "") String customerPhone
    ) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, orderService.getOrders(pageNumber, pageSize, fromDate,
                    toDate,orderBy,order,status,customerPhone)));
        } catch (ParseException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>("Invalid date format. Please use 'yyyy-MM-dd'.", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }


    @PostMapping
    public ResponseEntity<ApiResponse<CreateOrderResponse>> createOrderLive(@RequestBody OrderRequest orderRequest, HttpServletRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(REQUEST_SUCCESS, orderService.createOrder(orderRequest, request)));
        } catch (BadRequestUserException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderItemResponse>> getOrderById(@PathVariable("id") Long id) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, orderService.getOrderById(id)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/customer/{id}")
    @PreAuthorize("hasAuthority('CUSTOMER')")
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
    @PreAuthorize("hasAnyAuthority('MANAGER', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getOrdersByEmployee(
            @PathVariable("id") Long id,
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate
    ) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, orderService.getOrdersByEmployee(id, pageNumber, pageSize, fromDate, toDate)));
        } catch (ParseException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>("Invalid date format. Please use 'yyyy-MM-dd'.", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));

        }
    }


    @GetMapping("/customer-detail/{orderId}")
    @PreAuthorize("hasAuthority('CUSTOMER')")
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

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<String>> updateOrderStatus(@PathVariable("id") Long orderId,
                                                                 @RequestParam("orderStatus") String orderStatus) {
        try {
            orderService.updateOrderStatus(orderId, orderStatus);
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, orderStatus));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}
