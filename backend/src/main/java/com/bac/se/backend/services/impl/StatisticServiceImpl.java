package com.bac.se.backend.services.impl;

import com.bac.se.backend.mapper.ProductMapper;
import com.bac.se.backend.mapper.ProductPriceMapper;
import com.bac.se.backend.payload.response.product.BestSellingProductResponse;
import com.bac.se.backend.payload.response.product.StatisticPriceProductResponse;
import com.bac.se.backend.payload.response.statistic.StatisticResponse;
import com.bac.se.backend.repositories.OrderItemRepository;
import com.bac.se.backend.repositories.ProductPriceRepository;
import com.bac.se.backend.repositories.ProductRepository;
import com.bac.se.backend.services.StatisticService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatisticServiceImpl implements StatisticService {

    private final OrderItemRepository orderItemRepository;
    private final ProductPriceRepository productPriceRepository;
    private final ProductPriceMapper productPriceMapper;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    static final String DEFAULT_FROM_DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd", Locale.ENGLISH)
            .format(LocalDate.now().minusMonths(1));

    static final String DEFAULT_TO_DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd", Locale.ENGLISH)
            .format(LocalDate.now().plusDays(1));


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
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date from = fromDate != null ? dateFormat.parse(fromDate) : dateFormat.parse(DEFAULT_FROM_DATE);
        Date to = toDate != null ? dateFormat.parse(toDate) : dateFormat.parse(DEFAULT_TO_DATE);
        log.info("from: {} ",from);
        log.info("to: {}",to);
        return productRepository.getBestSellingProducts(request,from,to)
                .stream()
                .map(productMapper::mapObjectToBestSellingProduct)
                .toList();
    }


}
