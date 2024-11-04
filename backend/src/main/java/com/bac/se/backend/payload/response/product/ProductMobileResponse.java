package com.bac.se.backend.payload.response.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductMobileResponse {
    private Long productId;
    private String name;
    private String image;
    private String promotion;
    private Double price;
    private Double discountPrice;
    private Long shipmentId;
}
