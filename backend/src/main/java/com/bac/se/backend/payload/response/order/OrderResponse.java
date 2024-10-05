package com.bac.se.backend.payload.response.order;

import java.util.Date;

public record OrderResponse(
        Long orderId,
        String employee,
        double total, String orderStatus,
        String paymentType,
        Date createdAt
) {
}
