package com.bac.se.backend.payload.request;

import java.util.List;
import java.util.Optional;

public record OrderRequest(List<OrderItemRequest> orderItems,
                           Optional<String> customerPhone,
                           double customerPayment) // tiền khách đưa
{
}
