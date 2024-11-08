package com.bac.se.backend.mapper;

import com.bac.se.backend.payload.response.promotion.GiftPromotionResponse;
import com.bac.se.backend.payload.response.promotion.OrderPromotionResponse;
import com.bac.se.backend.payload.response.promotion.PromotionResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;

@Service
public class PromotionMapper {
    public OrderPromotionResponse mapToOrderPromotionResponse(Object[] obj) {
        return new OrderPromotionResponse(
                Long.parseLong(obj[0].toString()),
                new BigDecimal(obj[1].toString()),
                Double.parseDouble(obj[2].toString())
        );
    }

    public GiftPromotionResponse mapToGiftPromotionResponse(Object[] obj) {
        return new GiftPromotionResponse(
                Integer.parseInt(obj[0].toString()),
                Integer.parseInt(obj[1].toString()),
                obj[2].toString()
        );
    }

    public PromotionResponse mapToPromotionResponse(Object[] obj) {
        return new PromotionResponse(
                Long.parseLong(obj[0].toString()),
                obj[1].toString(),
                obj[2].toString(),
                (Date) obj[3],
                (Date) obj[4],
                obj[5].toString(),
                obj[6].toString(),
                Integer.parseInt(obj[7].toString())
        );
    }
}