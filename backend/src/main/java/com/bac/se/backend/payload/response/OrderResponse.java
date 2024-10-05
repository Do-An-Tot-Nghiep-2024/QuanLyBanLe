package com.bac.se.backend.payload.response;

import java.util.Date;
import java.util.List;

public record OrderResponse(List<OrderItemResponse> orderItemResponses
                            ,double totalPrice,
                            String paymentType,
                            Date createdAt){
}
