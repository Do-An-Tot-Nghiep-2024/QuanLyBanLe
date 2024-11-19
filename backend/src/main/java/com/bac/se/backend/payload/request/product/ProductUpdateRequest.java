package com.bac.se.backend.payload.request.product;

public record ProductUpdateRequest(String name,
                                   Long categoryId,
                                   Long supplierId) {
}
