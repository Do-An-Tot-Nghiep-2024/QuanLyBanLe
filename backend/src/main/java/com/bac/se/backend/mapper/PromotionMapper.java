package com.bac.se.backend.mapper;

import com.bac.se.backend.payload.response.promotion.LatestPromotionResponse;
import com.bac.se.backend.payload.response.promotion.PromotionResponse;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class PromotionMapper {
    public PromotionResponse mapToPromotionResponse(Object[] obj) {
        return new PromotionResponse(
                Long.parseLong(obj[0].toString()),
                obj[1].toString(),
                obj[2].toString(),
                (Date) obj[3],
                (Date) obj[4],
                Integer.parseInt(obj[5].toString()),
                Double.parseDouble(obj[6].toString()),
                Double.parseDouble(obj[7].toString())
        );
    }

    public LatestPromotionResponse mapToLatestPromotionResponse(Object[] obj) {
        return new LatestPromotionResponse(
                Long.parseLong(obj[0].toString()),
                Double.parseDouble(obj[0].toString()),
                Double.parseDouble(obj[1].toString()),
                Integer.parseInt(obj[2].toString()),
                (Date) obj[3]
        );
    }
}