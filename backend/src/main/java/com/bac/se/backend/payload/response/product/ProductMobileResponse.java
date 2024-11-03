package com.bac.se.backend.payload.response.product;

public record ProductMobileResponse(
    String name,
    String image,
    Double price,
    Double discountPrice,
    Long shipmentId
) {
}
