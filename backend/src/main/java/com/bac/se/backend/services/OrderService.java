package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.payload.request.OrderRequest;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.order.CreateOrderResponse;
import com.bac.se.backend.payload.response.order.OrderCustomerResponse;
import com.bac.se.backend.payload.response.order.OrderItemResponse;
import com.bac.se.backend.payload.response.order.OrderResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.text.ParseException;


public interface OrderService {
    CreateOrderResponse createOrder(OrderRequest orderRequest, HttpServletRequest request) throws BadRequestUserException;

    PageResponse<OrderResponse> getOrders(Integer pageNumber, Integer pageSize,
                                          String fromDate, String toDate,
                                          String orderBy,String order,String status,String customerPhone) throws ParseException;

    PageResponse<OrderResponse> getOrdersByCustomer(HttpServletRequest request, Integer pageNumber, Integer pageSize);

    PageResponse<OrderResponse> getOrdersByEmployee(HttpServletRequest request,
                                                    Integer pageNumber,
                                                    Integer pageSize,
                                                    String fromDate,
                                                    String toDate) throws ParseException;

    OrderCustomerResponse getOrderDetailByCustomer(Long orderId);

    OrderItemResponse getOrderById(Long orderId);

    void updateOrderStatus(Long orderId, String orderStatus);


}
