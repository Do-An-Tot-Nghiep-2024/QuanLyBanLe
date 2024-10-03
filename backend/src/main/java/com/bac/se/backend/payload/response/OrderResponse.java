package com.bac.se.backend.payload.response;

import java.util.List;

public record OrderResponse(List<OrderItemResponse> orderItemResponses
                            ,double totalPrice,
                            double customerPayment,
                            double change) {
}
