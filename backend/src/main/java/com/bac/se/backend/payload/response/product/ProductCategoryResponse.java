package com.bac.se.backend.payload.response.product;

public record ProductCategoryResponse(
        Long productId,
        String name,
        String image,
        Double price,
        Double discount
) {
}
