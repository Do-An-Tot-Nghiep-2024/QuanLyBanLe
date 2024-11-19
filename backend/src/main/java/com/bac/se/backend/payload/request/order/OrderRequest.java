package com.bac.se.backend.payload.request.order;

import java.util.List;
import java.util.Optional;

public record OrderRequest(List<OrderItemRequest> orderItems,
                           Optional<String> customerPhone,
                           double customerPayment,
                           Boolean isLive,
                           String paymentType,
                           double totalDiscount)
{
}
