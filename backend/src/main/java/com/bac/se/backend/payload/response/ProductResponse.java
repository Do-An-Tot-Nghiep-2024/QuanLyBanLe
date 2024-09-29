package com.bac.se.backend.payload.response;

public record ProductResponse(Long id,
                              String name, String image, double price
                             ) {
}
