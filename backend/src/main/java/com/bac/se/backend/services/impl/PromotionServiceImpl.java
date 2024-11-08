package com.bac.se.backend.services.impl;

import com.bac.se.backend.enums.PageLimit;
import com.bac.se.backend.enums.PromotionScope;
import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.mapper.PromotionMapper;
import com.bac.se.backend.models.*;
import com.bac.se.backend.payload.request.promotion.*;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.promotion.CreatePromotionResponse;
import com.bac.se.backend.payload.response.promotion.PromotionResponse;
import com.bac.se.backend.repositories.*;
import com.bac.se.backend.services.ProductPriceService;
import com.bac.se.backend.services.PromotionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PromotionServiceImpl implements PromotionService {

    private final PromotionTypeRepository promotionTypeRepository;
    private final PromotionRepository promotionRepository;
    private final ProductRepository productRepository;
    private final OrderPromotionRepository orderPromotionRepository;
    private final QuantityPromotionRepository quantityPromotionRepository;
    private final GiftPromotionRepository giftPromotionRepository;
    private final StockRepository stockRepository;
    private final ProductPriceService productPriceService;
    private final DiscountProductPromotionRepository discountProductPromotionRepository;
    private final PromotionMapper promotionMapper;

    void validatePromotion(PromotionRequest promotionRequest) throws BadRequestUserException {
        if (promotionRequest.promotionTypeId() == null
                || promotionRequest.endDate() == null
                || promotionRequest.startDate() == null
                || promotionRequest.name() == null
                || promotionRequest.description() == null) {
            throw new BadRequestUserException("Vui lòng nhập đầy đủ thông tin");
        }
        if (promotionRequest.endDate().before(promotionRequest.startDate())) {
            throw new BadRequestUserException("Ngày kết thúc phải lớn hơn ngày bắt đầu");
        }
    }

    @Override
    public CreatePromotionResponse createOrderPromotion(OrderPromotionRequest request) throws BadRequestUserException {
        validatePromotion(request.promotionRequest());
        if (request.minOrderValue() == null || request.discountPercent() == null) {
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
                .orderLimit(request.promotionRequest().orderLimit())
                .build();
        var save = promotionRepository.save(promotion);
        OrderPromotion orderPromotion = OrderPromotion.builder()
                .minOrderValue(request.minOrderValue())
                .discountPercent(request.discountPercent())
                .promotion(save)
                .build();
        orderPromotionRepository.save(orderPromotion);
        return new CreatePromotionResponse(promotion.getName(), promotion.getDescription(),
                promotion.getStartDate().toString(), promotion.getEndDate().toString(), promotion.getPromotionType().getId());
    }

    @Override
    public CreatePromotionResponse createQuantityProductPromotion(QuantityPromotionRequest request) throws BadRequestUserException {
        validatePromotion(request.promotionRequest());
        if (request.buyQuantity() == null || request.freeQuantity() == null || request.productId() == null) {
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
                .orderLimit(request.promotionRequest().orderLimit())
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
        return new CreatePromotionResponse(promotion.getName(), promotion.getDescription(),
                promotion.getStartDate().toString(), promotion.getEndDate().toString(), promotion.getPromotionType().getId());
    }

    @Override
    public CreatePromotionResponse createGiftProductPromotion(GiftPromotionRequest request) throws BadRequestUserException {
        validatePromotion(request.promotionRequest());
        if (request.buyQuantity() == null || request.giftQuantity() == null || request.productId() == null
                || request.giftProductId() == null || request.giftShipmentId() == null) {
            throw new BadRequestUserException("Vui lòng nhập đầy đủ thông tin");
        }

        PromotionType promotionType = promotionTypeRepository.findById(request.promotionRequest().promotionTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại khuyến mại"));

        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

        var availableQuantityStock = stockRepository.getAvailableQuantityStock(request.giftShipmentId(), request.giftProductId(),
                PageRequest.of(0, 1));
        if (availableQuantityStock.isEmpty()) {
            throw new BadRequestUserException("Không có số lượng lô hàng");
        }
        if (Integer.parseInt(availableQuantityStock.get(0)[0].toString()) < request.giftQuantity()) {
            throw new BadRequestUserException("Số lượng không đủ");
        }

        Promotion promotion = Promotion.builder()
                .name(request.promotionRequest().name())
                .description(request.promotionRequest().description())
                .startDate(request.promotionRequest().startDate())
                .endDate(request.promotionRequest().endDate())
                .promotionType(promotionType)
                .scope(PromotionScope.PRODUCT)
                .orderLimit(request.promotionRequest().orderLimit())
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
        return new CreatePromotionResponse(promotion.getName(), promotion.getDescription(),
                promotion.getStartDate().toString(), promotion.getEndDate().toString(), promotion.getPromotionType().getId());
    }

    @Override
    public CreatePromotionResponse createDiscountProductPromotion(DiscountProductPromotionRequest request) throws BadRequestUserException {
        validatePromotion(request.promotionRequest());
        if (request.productId() == null || request.discount() == null) {
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
                .orderLimit(request.promotionRequest().orderLimit())
                .build();
        var save = promotionRepository.save(promotion);
        product.setPromotion(save);
        productRepository.save(product);

        var priceLatest = productPriceService.getPriceLatest(request.productId());


        ProductPrice productPrice = ProductPrice.builder()
                .product(product)
                .createdAt(new Date())
                .originalPrice(priceLatest.originalPrice())
                .price(priceLatest.price())
                .isPromotion(true)
                .discountPrice(priceLatest.price() - (priceLatest.price() * request.discount()))
                .build();
        productPriceService.createProductPrice(productPrice);
        DiscountProductPromotion discountProductPromotion = DiscountProductPromotion.builder()
                .promotion(save)
                .discount(request.discount())
                .build();
        discountProductPromotionRepository.save(discountProductPromotion);
        return new CreatePromotionResponse(promotion.getName(), promotion.getDescription(),
                promotion.getStartDate().toString(), promotion.getEndDate().toString(), promotion.getPromotionType().getId());
    }

    @Override
    public Long getPromotionProduct(Long productId) {
        long promotionId = 0L;
        List<Object[]> promotionList = promotionRepository.existPromotionByProduct(productId, PageLimit.ONLY.getPageable());
        if (!promotionList.isEmpty()) {
            promotionId = Long.parseLong(promotionList.get(0)[0].toString());
        }
        return promotionId;
    }

    @Override
    public PageResponse<PromotionResponse> getPromotions(Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Object[]> page = promotionRepository.getPromotions(pageable);
        List<PromotionResponse> promotionResponseList = page.getContent()
                .stream().map(promotionMapper::mapToPromotionResponse).toList();
        return new PageResponse<>(promotionResponseList, pageNumber,
                page.getTotalPages(), page.getTotalElements(), page.isLast());
    }

}
