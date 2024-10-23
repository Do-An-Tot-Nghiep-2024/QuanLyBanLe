package com.bac.se.backend.services.impl;

import com.bac.se.backend.mapper.ProductPriceMapper;
import com.bac.se.backend.payload.response.product.StatisticPriceProductResponse;
import com.bac.se.backend.payload.response.statistic.StatisticResponse;
import com.bac.se.backend.repositories.OrderItemRepository;
import com.bac.se.backend.repositories.ProductPriceRepository;
import com.bac.se.backend.services.StatisticService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticServiceImpl implements StatisticService {

    private final OrderItemRepository orderItemRepository;
    private final ProductPriceRepository productPriceRepository;
    private final ProductPriceMapper productPriceMapper;


    @Override
    public List<StatisticResponse> salesStatisticsByProduct() {
        var objects = orderItemRepository.salesStatisticsByProduct();
        return objects.stream().map(obj -> new StatisticResponse(obj[0].toString(), BigDecimal.valueOf(Double.parseDouble(obj[1].toString())))).toList();
    }

    @Override
    public List<StatisticResponse> salesStatisticsByEmployee() {
        var objects = orderItemRepository.salesStatisticsByEmployee();
        return objects.stream().map(obj -> new StatisticResponse(obj[0].toString(), BigDecimal.valueOf(Double.parseDouble(obj[1].toString())))).toList();
    }
    @Override
    public List<StatisticPriceProductResponse> statisticsProductPriceByTime(Long productId) {
        var productPricesByProduct = productPriceRepository.getProductPricesByProduct(productId);
        return productPricesByProduct
                .stream()
                .map(productPriceMapper::mapObjectToStatisticsProductPrice)
                .toList();
    }


}
