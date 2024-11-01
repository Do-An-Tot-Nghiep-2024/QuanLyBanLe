package com.bac.se.backend.services.impl;

import com.bac.se.backend.enums.PromotionScope;
import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.models.*;
import com.bac.se.backend.payload.request.promotion.GiftPromotionRequest;
import com.bac.se.backend.payload.request.promotion.OrderPromotionRequest;
import com.bac.se.backend.payload.request.promotion.PromotionRequest;
import com.bac.se.backend.payload.request.promotion.QuantityPromotionRequest;
import com.bac.se.backend.payload.response.promotion.PromotionResponse;
import com.bac.se.backend.repositories.*;
import com.bac.se.backend.services.PromotionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PromotionServiceImpl implements PromotionService {

    private final PromotionTypeRepository promotionTypeRepository;
    private final PromotionRepository promotionRepository;
    private final ProductRepository productRepository;
    private final ShipmentRepository shipmentRepository;
    private final OrderPromotionRepository orderPromotionRepository;
    private final QuantityPromotionRepository quantityPromotionRepository;
    private final GiftPromotionRepository giftPromotionRepository;
    private final StockRepository stockRepository;



    void validatePromotion(PromotionRequest promotionRequest) throws BadRequestUserException {
        if(promotionRequest.promotionTypeId() == null
    || promotionRequest.endDate() == null
    || promotionRequest.startDate() == null
    || promotionRequest.name() == null
    || promotionRequest.description() == null)
        {
            throw new BadRequestUserException("Vui lòng nhập đầy đủ thông tin");
        }
        if(promotionRequest.endDate().before(promotionRequest.startDate())){
            throw new BadRequestUserException("Ngày kết thúc phải lớn hơn ngày bắt đầu");
        }
    }

    @Override
    public PromotionResponse createOrderPromotion(OrderPromotionRequest request) throws BadRequestUserException {
        validatePromotion(request.promotionRequest());
        if(request.minOrderValue() == null || request.discountPercent() == null)
        {
            throw new BadRequestUserException("Vui lòng nhập đầy đủ thông tin");
        }
        PromotionType promotionType = promotionTypeRepository.findById(request.promotionRequest().promotionTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại khuyến mại"));

        Promotion promotion = Promotion.builder()
                .name(request.promotionRequest().name())
                .description(request.promotionRequest().description())
                .startDate(request.promotionRequest().startDate())
                .endDate(request.promotionRequest().endDate())
                .promotionType(promotionType)
                .scope(PromotionScope.ORDER)
                .build();
        var save = promotionRepository.save(promotion);
        OrderPromotion orderPromotion = OrderPromotion.builder()
                .minOrderValue(request.minOrderValue())
                .discountPercent(request.discountPercent())
                .promotion(save)
                .build();
        orderPromotionRepository.save(orderPromotion);
        return new PromotionResponse(promotion.getName(),promotion.getDescription(),
                promotion.getStartDate().toString(),promotion.getEndDate().toString(),promotion.getPromotionType().getId());
    }

    @Override
    public PromotionResponse createQuantityProductPromotion(QuantityPromotionRequest request) throws BadRequestUserException {
        validatePromotion(request.promotionRequest());
        if(request.buyQuantity() == null || request.freeQuantity() == null || request.productId() == null)
        {
            throw new BadRequestUserException("Vui lòng nhập đầy đủ thông tin");
        }

        PromotionType promotionType = promotionTypeRepository.findById(request.promotionRequest().promotionTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại khuyến mại"));

        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));
        Promotion promotion = Promotion.builder()
                .name(request.promotionRequest().name())
                .description(request.promotionRequest().description())
                .startDate(request.promotionRequest().startDate())
                .endDate(request.promotionRequest().endDate())
                .promotionType(promotionType)
                .scope(PromotionScope.PRODUCT)
                .build();
        var save = promotionRepository.save(promotion);

        QuantityPromotion quantityPromotion = QuantityPromotion.builder()
                .buyQuantity(request.buyQuantity())
                .freeQuantity(request.freeQuantity())
                .promotion(save)
                .build();
        quantityPromotionRepository.save(quantityPromotion);
        product.setPromotion(save);
        productRepository.save(product);
        return new PromotionResponse(promotion.getName(),promotion.getDescription(),
                promotion.getStartDate().toString(),promotion.getEndDate().toString(),promotion.getPromotionType().getId());
    }

    @Override
    public PromotionResponse createGiftProductPromotion(GiftPromotionRequest request) throws BadRequestUserException {
        validatePromotion(request.promotionRequest());
        if(request.buyQuantity() == null || request.giftQuantity() == null || request.productId() == null
                || request.giftProductId() == null || request.giftShipmentId() == null)
        {
            throw new BadRequestUserException("Vui lòng nhập đầy đủ thông tin");
        }

        PromotionType promotionType = promotionTypeRepository.findById(request.promotionRequest().promotionTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại khuyến mại"));

        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

        var availableQuantityStock = stockRepository.getAvailableQuantityStock(request.giftShipmentId(), request.giftProductId(),
                PageRequest.of(0, 1));
        if(availableQuantityStock.isEmpty()){
            throw new BadRequestUserException("Không có số lượng lô hàng");
        }
        if(Integer.parseInt(availableQuantityStock.get(0)[0].toString()) < request.giftQuantity()){
            throw new BadRequestUserException("Số lượng không đủ");
        }

        Promotion promotion = Promotion.builder()
                .name(request.promotionRequest().name())
                .description(request.promotionRequest().description())
                .startDate(request.promotionRequest().startDate())
                .endDate(request.promotionRequest().endDate())
                .promotionType(promotionType)
                .scope(PromotionScope.PRODUCT)
                .build();
        var save = promotionRepository.save(promotion);

        GiftPromotion giftPromotion = GiftPromotion.builder()
                .buyQuantity(request.buyQuantity())
                .giftQuantity(request.giftQuantity())
                .giftProductId(request.giftProductId())
                .giftShipmentId(request.giftShipmentId())
                .promotion(save)
                .build();
        giftPromotionRepository.save(giftPromotion);
        product.setPromotion(save);
        productRepository.save(product);
        return new PromotionResponse(promotion.getName(),promotion.getDescription(),
                promotion.getStartDate().toString(),promotion.getEndDate().toString(),promotion.getPromotionType().getId());
    }
}
