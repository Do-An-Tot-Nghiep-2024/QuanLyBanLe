package com.bac.se.backend.payload.response;

import java.util.List;

public record CreateOrderResponse(
        List<OrderItemResponse> orderItemResponses
        ,double totalPrice,
        double customerPayment,
        double change
) {
}
