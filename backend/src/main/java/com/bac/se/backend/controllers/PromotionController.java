package com.bac.se.backend.controllers;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.payload.request.promotion.DiscountProductPromotionRequest;
import com.bac.se.backend.payload.request.promotion.GiftPromotionRequest;
import com.bac.se.backend.payload.request.promotion.OrderPromotionRequest;
import com.bac.se.backend.payload.request.promotion.QuantityPromotionRequest;
import com.bac.se.backend.payload.response.common.ApiResponse;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.promotion.CreatePromotionResponse;
import com.bac.se.backend.payload.response.promotion.PromotionResponse;
import com.bac.se.backend.services.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/promotions")
@RequiredArgsConstructor
public class PromotionController {
    private final PromotionService promotionService;

    final String REQUEST_ACCEPT = "success";


    @GetMapping
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<PageResponse<PromotionResponse>>> getPromotions(
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize) {

        try {
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_ACCEPT, promotionService.getPromotions(pageNumber, pageSize)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @PostMapping("/create-order-promotion")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<CreatePromotionResponse>> createOrderPromotion(@RequestBody OrderPromotionRequest request) {
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
    public ResponseEntity<ApiResponse<CreatePromotionResponse>> createQuantityProductPromotion(@RequestBody QuantityPromotionRequest request) {
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
    public ResponseEntity<ApiResponse<CreatePromotionResponse>> createGiftProductPromotion(@RequestBody GiftPromotionRequest request) {
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

    @PostMapping("/create-discount-product")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<CreatePromotionResponse>> createDiscountProductPromotion(@RequestBody DiscountProductPromotionRequest request) {
        try {
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(REQUEST_ACCEPT,
                            promotionService.createDiscountProductPromotion(request)));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}
