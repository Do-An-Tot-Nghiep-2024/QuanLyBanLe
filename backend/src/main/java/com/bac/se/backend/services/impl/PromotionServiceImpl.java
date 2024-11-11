package com.bac.se.backend.services.impl;

import com.bac.se.backend.enums.PageLimit;
import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.mapper.PromotionMapper;
import com.bac.se.backend.models.Promotion;
import com.bac.se.backend.payload.request.promotion.PromotionRequest;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.promotion.LatestPromotionResponse;
import com.bac.se.backend.payload.response.promotion.PromotionResponse;
import com.bac.se.backend.repositories.PromotionRepository;
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

    private final PromotionRepository promotionRepository;
    private final PromotionMapper promotionMapper;


    @Override
    public PageResponse<PromotionResponse> getPromotions(Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Object[]> page = promotionRepository.getPromotions(pageable);
        List<PromotionResponse> promotionResponseList = page.getContent()
                .stream().map(promotionMapper::mapToPromotionResponse).toList();
        return new PageResponse<>(promotionResponseList, pageNumber,
                page.getTotalPages(), page.getTotalElements(), page.isLast());
    }

    @Override
    public LatestPromotionResponse getLatestPromotion() {
        var latestPromotion = promotionRepository.getLatestPromotion(PageLimit.ONLY.getPageable());
        if(latestPromotion.isEmpty()){
            throw new ResourceNotFoundException("Không tìm thấy chương trình khuyến mãi");
        }
        LatestPromotionResponse latestPromotionResponse = promotionMapper.mapToLatestPromotionResponse(latestPromotion.get(0));
        if(latestPromotionResponse.endDate().before(new Date()) || latestPromotionResponse.orderLimit() <= 0){
            throw new ResourceNotFoundException("Chương trình khuyến mãi không khả dụng");
        }
        return latestPromotionResponse;
    }

    @Override
    public PromotionResponse createPromotion(PromotionRequest request) throws BadRequestUserException {
        validatePromotion(request);
        Promotion promotion = Promotion.builder()
                .name(request.name())
                .description(request.description())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .orderLimit(request.orderLimit())
                .minOrderValue(request.minOrderValue())
                .percentage(request.discountPercent() / 100)
                .build();
        promotionRepository.save(promotion);
        return new PromotionResponse(promotion.getId(),
                promotion.getName(),
                promotion.getDescription(),
                promotion.getStartDate(),
                promotion.getEndDate(),
                promotion.getOrderLimit(),
                promotion.getMinOrderValue(),
                promotion.getPercentage()
        );
    }

    @Override
    public void minusOrderLimit(Long id) {
        var promotion = promotionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chương trình khuyến mãi"));
        promotion.setOrderLimit(promotion.getOrderLimit() - 1);
        promotionRepository.save(promotion);
    }

    void validatePromotion(PromotionRequest request) throws BadRequestUserException {
        if (request.name().isEmpty() ||
                request.description().isEmpty() ||
                request.startDate() == null ||
                request.endDate() == null ||
                request.orderLimit() == null ||
                request.minOrderValue() == null ||
                request.discountPercent() == null) {
            throw new BadRequestUserException("Vui lòng nhập đẩy đủ thông tin");
        }
        if (request.endDate().before(request.startDate())) {
            throw new BadRequestUserException("Ngày kết thúc phải sau ngày bắt đầu");
        }
        if (request.orderLimit() <= 0) {
            throw new BadRequestUserException("Số lượng sản phẩm tối đa phải lớn hơn 0");
        }
        if (request.minOrderValue() <= 0) {
            throw new BadRequestUserException("Giá tối thiểu phải lớn hơn 0");
        }
        if (request.discountPercent() <= 0 || request.discountPercent() > 100) {
            throw new BadRequestUserException("Phần trăm giá phải lớn hơn 0 và nhỏ hơn 100");
        }
    }
}
