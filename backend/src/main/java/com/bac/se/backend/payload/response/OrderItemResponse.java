package com.bac.se.backend.payload.response;

public record OrderItemResponse(String name,int quantity,
                                double price,
                                double discountPrice,
                                double totalPrice) {
}
