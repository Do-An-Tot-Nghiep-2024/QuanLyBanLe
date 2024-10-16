package com.bac.se.backend.payload.response.product;

import java.util.List;

public record ProductResponse(Long id, String name,
                              String image,
                              String category, String supplier,
                              double originalPrice, double price,
                              double discountPrice,
                              List<Long> shipmentIds
) {
}
