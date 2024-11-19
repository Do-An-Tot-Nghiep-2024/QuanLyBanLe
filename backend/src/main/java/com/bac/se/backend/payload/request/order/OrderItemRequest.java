package com.bac.se.backend.payload.request.order;

public record OrderItemRequest(Long productId,Long shipmentId,int quantity) {

}
