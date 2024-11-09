package com.bac.se.backend.services.impl;

import com.bac.se.backend.mapper.ProductMapper;
import com.bac.se.backend.mapper.ProductPriceMapper;
import com.bac.se.backend.payload.request.DateRequest;
import com.bac.se.backend.payload.response.product.BestSellingProductResponse;
import com.bac.se.backend.payload.response.product.StatisticPriceProductResponse;
import com.bac.se.backend.payload.response.statistic.StatisticResponse;
import com.bac.se.backend.repositories.OrderItemRepository;
import com.bac.se.backend.repositories.ProductPriceRepository;
import com.bac.se.backend.repositories.ProductRepository;
import com.bac.se.backend.services.StatisticService;
import com.bac.se.backend.utils.DateConvert;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatisticServiceImpl implements StatisticService {

    private final OrderItemRepository orderItemRepository;
    private final ProductPriceRepository productPriceRepository;
    private final ProductPriceMapper productPriceMapper;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final DateConvert dateConvert;


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

    @Override
    public List<BestSellingProductResponse> statisticsBestSellingProduct(String fromDate, String toDate) throws ParseException {
        Pageable request = PageRequest.of(0,10);
        DateRequest dateRequest = dateConvert.convertDateRequest(fromDate, toDate);
        return productRepository.getBestSellingProducts(request,dateRequest.fromDate(),
                        dateRequest.toDate())
                .stream()
                .map(productMapper::mapObjectToBestSellingProduct)
                .toList();
    }


}
