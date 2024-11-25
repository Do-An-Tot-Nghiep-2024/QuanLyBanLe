package com.bac.se.backend.services.impl;

import com.bac.se.backend.enums.PageLimit;
import com.bac.se.backend.mapper.ProductMapper;
import com.bac.se.backend.mapper.ProductPriceMapper;
import com.bac.se.backend.mapper.StatisticMapper;
import com.bac.se.backend.payload.request.DateRequest;
import com.bac.se.backend.payload.response.common.OrderDateResponse;
import com.bac.se.backend.payload.response.product.StatisticPriceProductResponse;
import com.bac.se.backend.payload.response.statistic.SaleAndProfitResponse;
import com.bac.se.backend.payload.response.statistic.StatisticResponse;
import com.bac.se.backend.payload.response.statistic.product.BestSellingProductResponse;
import com.bac.se.backend.payload.response.statistic.product.TopFiveHighestGrossingProductResponse;
import com.bac.se.backend.repositories.OrderItemRepository;
import com.bac.se.backend.repositories.OrderRepository;
import com.bac.se.backend.repositories.ProductPriceRepository;
import com.bac.se.backend.repositories.ProductRepository;
import com.bac.se.backend.services.StatisticService;
import com.bac.se.backend.utils.DateConvert;
import com.bac.se.backend.utils.JwtParse;
import jakarta.servlet.http.HttpServletRequest;
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
    private final OrderRepository orderRepository;
    private final JwtParse jwtParse;
    private final StatisticMapper statisticMapper;


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
    public List<OrderDateResponse<BigDecimal>> getTotalSalesByEmp(HttpServletRequest request,
                                                                  String fromDate, String toDate) throws ParseException {
        String email = jwtParse.decodeTokenWithRequest(request);
        DateRequest dateRequest = dateConvert.convertCurrentDateRequest(fromDate, toDate);
        return orderRepository.getTotalSalesByEmployee(email,dateRequest.fromDate(),dateRequest.toDate())
                .stream()
                .map(statisticMapper::mapObjectToTotalSalesResponse)
                .toList();
    }

    @Override
    public List<OrderDateResponse<Integer>> getCurrentTotalOrdersOfEmployee(HttpServletRequest request,
                                                                            String fromDate, String toDate) throws ParseException {
        String email = jwtParse.decodeTokenWithRequest(request);
        DateRequest dateRequest = dateConvert.convertCurrentDateRequest(fromDate, toDate);
        return orderRepository.getTotalOrdersByEmployee(email,dateRequest.fromDate(),dateRequest.toDate())
                .stream()
                .map(statisticMapper::mapObjectToTotalOrdersResponse)
                .toList();
    }

    @Override
    public List<BestSellingProductResponse> statisticsBestSellingProduct(String fromDate, String toDate) throws ParseException {
        Pageable request = PageRequest.of(0,10);
        DateRequest dateRequest = dateConvert.convertMothRequest(fromDate, toDate);
        return productRepository.getBestSellingProducts(request,dateRequest.fromDate(),
                        dateRequest.toDate())
                .stream()
                .map(productMapper::mapObjectToBestSellingProduct)
                .toList();
    }

    @Override
    public List<TopFiveHighestGrossingProductResponse> statisticsTopFiveHighestGrossingProduct(String fromDate, String toDate) throws ParseException {
        DateRequest dateRequest = dateConvert.convertMothRequest(fromDate, toDate);
        PageRequest pageRequest = PageRequest.of(0,5);
        return orderItemRepository.getTopFiveHighestGrossingProduct(pageRequest,dateRequest.fromDate(),
                dateRequest.toDate())
                .stream()
                .map(statisticMapper::mapObjectToTopFiveHighestGrossingProduct)
                .toList();
    }

    @Override
    public List<StatisticResponse> statisticsBySupplier() {
        return orderItemRepository.getSalesBySupplier()
                .stream()
                .map(statisticMapper::mapObjectToStatisticResponse)
                .toList();
    }



    @Override
    public BigDecimal getCurrentTotalSales() {
        var currentTotalSales = orderItemRepository.getCurrentTotalSales(PageLimit.ONLY.getPageable());
        BigDecimal totalSales = BigDecimal.ZERO;
        if(!currentTotalSales.isEmpty()){
            Object[] currentTotalSalesObject = currentTotalSales.get(0);
            if(currentTotalSalesObject != null){
                totalSales = BigDecimal.valueOf(Double.parseDouble(currentTotalSales.get(0)[0].toString()));
            }
        }
        return totalSales;
    }

    @Override
    public Long getCurrentTotalOrders() {
        return orderRepository.getCurrentTotalOrders();
    }

    @Override
    public BigDecimal getCurrentNetTotalProfit() {
        var netTotalProfitCurrent = orderRepository.getNetTotalProfitCurrent(PageLimit.ONLY.getPageable());
        if(!netTotalProfitCurrent.isEmpty()){
            Object[] profit = netTotalProfitCurrent.get(0);
            if(profit == null){
                return BigDecimal.ZERO;
            }
            return BigDecimal.valueOf(Double.parseDouble(netTotalProfitCurrent.get(0)[0].toString()));
        }
        return BigDecimal.ZERO;
    }

    @Override
    public List<SaleAndProfitResponse> getSalesAndProfitByDate(String fromDate, String toDate) throws ParseException {
        DateRequest dateRequest = dateConvert.convertCurrentDateRequest(fromDate, toDate);
        var salesAndProfit = orderItemRepository.getSalesAndProfitByDate(dateRequest.fromDate(),dateRequest.toDate());
        return salesAndProfit.stream().map(statisticMapper::mapObjectToSaleAndProfitResponse).toList();
    }

}
