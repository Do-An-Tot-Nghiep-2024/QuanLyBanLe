package com.bac.se.backend.payload.request;

public record OrderItemRequest(Long productId,Long shipmentId,int quantity) {

}
