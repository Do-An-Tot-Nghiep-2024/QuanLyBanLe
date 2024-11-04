package com.bac.se.backend.mapper;

import com.bac.se.backend.payload.response.promotion.OrderPromotionResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PromotionMapper {
    public OrderPromotionResponse mapToPromotionResponse(Object[] obj) {
        return new OrderPromotionResponse(
                Long.parseLong(obj[0].toString()),
                new BigDecimal(obj[1].toString()),
                Double.parseDouble(obj[2].toString())
        );
    }
}
