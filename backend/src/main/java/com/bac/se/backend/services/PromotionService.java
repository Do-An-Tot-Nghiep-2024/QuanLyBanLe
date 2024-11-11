package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.payload.request.promotion.PromotionRequest;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.promotion.LatestPromotionResponse;
import com.bac.se.backend.payload.response.promotion.PromotionResponse;

public interface PromotionService {

    PageResponse<PromotionResponse> getPromotions(Integer pageNumber, Integer pageSize);

    LatestPromotionResponse getLatestPromotion();

    PromotionResponse createPromotion(PromotionRequest promotionRequest) throws BadRequestUserException;

    void minusOrderLimit(Long id);

}
