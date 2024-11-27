package com.bac.se.backend.controllers;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.payload.request.order.OrderRequest;
import com.bac.se.backend.payload.response.common.ApiResponse;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.order.CreateOrderResponse;
import com.bac.se.backend.payload.response.order.OrderCustomerResponse;
import com.bac.se.backend.payload.response.order.OrderItemResponse;
import com.bac.se.backend.payload.response.order.OrderResponse;
import com.bac.se.backend.services.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@Slf4j
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    static final String REQUEST_SUCCESS = "success";



    @GetMapping
    @PreAuthorize("hasAnyAuthority('MANAGER','EMPLOYEE')")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getOrders(
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(defaultValue = "createdAt") String orderBy,
            @RequestParam(defaultValue = "DESC") String order,
            @RequestParam(defaultValue = "") String status,
            @RequestParam(defaultValue = "") String paymentType,
            @RequestParam(defaultValue = "") String customerPhone
    ) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, orderService.getOrders(pageNumber, pageSize, fromDate,
                    toDate,orderBy,order,status,paymentType,customerPhone)));
        } catch (ParseException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>("Invalid date format. Please use 'yyyy-MM-dd'.", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }


    @PostMapping
    public ResponseEntity<ApiResponse<CreateOrderResponse>> createOrder(@RequestBody OrderRequest orderRequest, HttpServletRequest request) {
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

    @GetMapping("/customer")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getOrderByCustomer(
           HttpServletRequest request,
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, orderService.getOrdersByCustomer(request, pageNumber, pageSize)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/employee")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getOrdersByEmployee(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(defaultValue = "") String status,
            @RequestParam(defaultValue = "") String customerPhone,
            @RequestParam(defaultValue = "") String paymentType
    ) {
        try {
            log.info("request is {}",request);
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, orderService.getOrdersByEmployee(request,
                    pageNumber, pageSize, fromDate, toDate,status,customerPhone,paymentType)));
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

    @PutMapping("/status/{id}")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<String>> updateOrderStatus(@PathVariable("id") Long orderId) {
        try {
            orderService.updateOrderStatus(orderId);
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, "Đơn hàng " + orderId + " đã được hoàn thành"));
        }catch (BadRequestUserException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    // cancel order by id
    @PutMapping("/cancel/{id}")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<String>> cancelOrder(@PathVariable("id") Long orderId) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, orderService.cancelOrder(orderId)));
        }catch (ResourceNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }catch (BadRequestUserException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}
