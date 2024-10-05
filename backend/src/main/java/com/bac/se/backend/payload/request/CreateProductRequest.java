package com.bac.se.backend.payload.request;

public record CreateProductRequest(String name,
                                   Long categoryId,
                                   Long supplierId) {
}
