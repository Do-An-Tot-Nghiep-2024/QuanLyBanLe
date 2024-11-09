package com.bac.se.backend.payload.response.order;

import java.util.Date;

public record OrderResponse(
        Long orderId,
        String employee,
        String orderStatus,
        String paymentType,
        double total,
        Date createdAt,
        String customerPhone
) {
}
