package com.bac.se.backend.payload.response;

public record CreateProductResponse(Long id,String name, String image, String category, String supplier) {
}
