package com.bac.se.backend.payload.response.order;

import java.util.Date;
import java.util.List;

public record OrderItemResponse(
        Long orderId,
        String employee,
        String orderStatus,
        String paymentType,
        double total,
        double totalDiscount,
        double customerPayment,
        Date createdAt,
        String customerPhone,
        double percentage,
        double minOrderValue,
        List<ProductOrderItemResponse> orderItemResponses
) {
}
