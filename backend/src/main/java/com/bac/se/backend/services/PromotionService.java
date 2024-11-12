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

    void deletePromotion(Long id);

    PromotionResponse updatePromotion(Long id, PromotionRequest request) throws BadRequestUserException;

    PromotionResponse getPromotionById(Long id);

    void minusOrderLimit(Long id);

}
