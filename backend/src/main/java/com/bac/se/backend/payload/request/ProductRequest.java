package com.bac.se.backend.payload.request;

public record ProductRequest(String name,
                             Long categoryId,
                             Long supplierId,
                             double originalPrice,
                             double price) {
}
