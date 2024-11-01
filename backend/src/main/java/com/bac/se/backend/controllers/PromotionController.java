package com.bac.se.backend.controllers;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.payload.request.promotion.GiftPromotionRequest;
import com.bac.se.backend.payload.request.promotion.OrderPromotionRequest;
import com.bac.se.backend.payload.request.promotion.QuantityPromotionRequest;
import com.bac.se.backend.payload.response.common.ApiResponse;
import com.bac.se.backend.payload.response.promotion.PromotionResponse;
import com.bac.se.backend.services.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/promotions")
@RequiredArgsConstructor
public class PromotionController {
    private final PromotionService promotionService;

    final String REQUEST_ACCEPT = "success";


    @PostMapping("/create-order-promotion")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<PromotionResponse>> createOrderPromotion(@RequestBody OrderPromotionRequest request) {
        try {
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(REQUEST_ACCEPT, promotionService.createOrderPromotion(request)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ApiResponse<>(e.getMessage(), null)
            );
        } catch (BadRequestUserException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new ApiResponse<>(e.getMessage(), null)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }


    @PostMapping("/create-quantity-product-promotion")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<PromotionResponse>> createQuantityProductPromotion(@RequestBody QuantityPromotionRequest request) {
        try {
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(REQUEST_ACCEPT, promotionService.createQuantityProductPromotion(request)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ApiResponse<>(e.getMessage(), null)
            );
        } catch (BadRequestUserException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new ApiResponse<>(e.getMessage(), null)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }


    @PostMapping("/create-gift-product-promotion")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<PromotionResponse>> createGiftProductPromotion(@RequestBody GiftPromotionRequest request) {
        try {
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(REQUEST_ACCEPT, promotionService.createGiftProductPromotion(request)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ApiResponse<>(e.getMessage(), null)
            );
        } catch (BadRequestUserException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new ApiResponse<>(e.getMessage(), null)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}
