package com.bac.se.backend.payload.response.order;

public record OrderItemQueryResponse(double price,
                                     String name,
                                     int quantity,
                                     double totalPrice) {
}
