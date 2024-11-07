package com.bac.se.backend.payload.response.product;

import com.bac.se.backend.payload.response.promotion.GiftPromotionResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String image;
    private String category;
    private String unit;
    private double price;
    private double discountPrice;
    private List<Long> shipmentIds;
    private GiftPromotionResponse giftPromotion;
}
