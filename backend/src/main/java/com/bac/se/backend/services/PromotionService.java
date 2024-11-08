package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.payload.request.promotion.DiscountProductPromotionRequest;
import com.bac.se.backend.payload.request.promotion.GiftPromotionRequest;
import com.bac.se.backend.payload.request.promotion.OrderPromotionRequest;
import com.bac.se.backend.payload.request.promotion.QuantityPromotionRequest;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.promotion.CreatePromotionResponse;
import com.bac.se.backend.payload.response.promotion.PromotionResponse;

public interface PromotionService {

    CreatePromotionResponse createOrderPromotion(OrderPromotionRequest request) throws BadRequestUserException;

    CreatePromotionResponse createQuantityProductPromotion(QuantityPromotionRequest request) throws BadRequestUserException;

    CreatePromotionResponse createGiftProductPromotion(GiftPromotionRequest request) throws BadRequestUserException;

    CreatePromotionResponse createDiscountProductPromotion(DiscountProductPromotionRequest request) throws BadRequestUserException;

    Long getPromotionProduct(Long productId);

    PageResponse<PromotionResponse> getPromotions(Integer pageNumber, Integer pageSize);

}
