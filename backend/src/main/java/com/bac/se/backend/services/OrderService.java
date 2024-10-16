package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.payload.request.OrderRequest;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.order.CreateOrderResponse;
import com.bac.se.backend.payload.response.order.OrderCustomerResponse;
import com.bac.se.backend.payload.response.order.OrderResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Date;


public interface OrderService {
    CreateOrderResponse createOrderLive(OrderRequest orderRequest, HttpServletRequest request) throws BadRequestUserException;
    PageResponse<OrderResponse> getOrdersByCustomer(Long customerId, int pageNumber, int pageSize);
    PageResponse<OrderResponse> getOrdersByEmployee(Long employeeId, int pageNumber, int pageSize);
    PageResponse<OrderResponse> getOrdersEmployeeByDate(Long employeeId, int pageNumber, int pageSize, Date fromDate,Date toDate);
    OrderCustomerResponse getOrderDetailByCustomer(Long orderId);

}
