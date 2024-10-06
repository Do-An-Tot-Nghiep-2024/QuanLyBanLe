package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.payload.request.OrderRequest;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.order.CreateOrderResponse;
import com.bac.se.backend.payload.response.order.OrderCustomerResponse;
import com.bac.se.backend.payload.response.order.OrderResponse;
import jakarta.servlet.http.HttpServletRequest;


public interface OrderService {
    CreateOrderResponse createOrderLive(OrderRequest orderRequest, HttpServletRequest request) throws BadRequestUserException;
    PageResponse<OrderResponse> getOrdersByCustomer(Long id, int pageNumber, int pageSize);
    OrderCustomerResponse getOrderDetailByCustomer(Long orderId);
}
