package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.payload.request.promotion.GiftPromotionRequest;
import com.bac.se.backend.payload.request.promotion.OrderPromotionRequest;
import com.bac.se.backend.payload.request.promotion.QuantityPromotionRequest;
import com.bac.se.backend.payload.response.promotion.PromotionResponse;

public interface PromotionService {

    PromotionResponse createOrderPromotion(OrderPromotionRequest request) throws BadRequestUserException;

    PromotionResponse createQuantityProductPromotion(QuantityPromotionRequest request) throws BadRequestUserException;

    PromotionResponse createGiftProductPromotion(GiftPromotionRequest request) throws BadRequestUserException;

}
