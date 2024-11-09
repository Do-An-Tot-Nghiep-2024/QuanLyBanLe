package com.bac.se.backend.payload.response.order;

import java.util.List;

public record CreateOrderResponse(
        List<ProductOrderItemResponse> orderItemResponses
        , double totalPrice,
        double customerPayment,
        double change,
        List<ProductOrderItemResponse> giftProducts
) {
}
