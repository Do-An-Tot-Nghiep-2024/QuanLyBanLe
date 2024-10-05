package com.bac.se.backend.payload.response.order;

public record OrderItemResponse(String name,int quantity,
                                double price,
                                double discountPrice,
                                double totalPrice) {
}
