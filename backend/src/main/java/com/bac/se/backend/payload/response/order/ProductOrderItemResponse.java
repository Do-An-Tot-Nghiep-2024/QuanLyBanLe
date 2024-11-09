package com.bac.se.backend.payload.response.order;

public record ProductOrderItemResponse(String name,
                                       int quantity,
                                       double price,
                                       double totalPrice,
                                       double totalDiscount) {

}
