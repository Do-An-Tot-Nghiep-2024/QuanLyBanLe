package com.bac.se.backend.services.impl;

import com.bac.se.backend.enums.PageLimit;
import com.bac.se.backend.mapper.ProductMapper;
import com.bac.se.backend.mapper.ProductPriceMapper;
import com.bac.se.backend.mapper.StatisticMapper;
import com.bac.se.backend.mapper.StockMapper;
import com.bac.se.backend.payload.request.DateRequest;
import com.bac.se.backend.payload.response.common.OrderDateResponse;
import com.bac.se.backend.payload.response.product.StatisticPriceProductResponse;
import com.bac.se.backend.payload.response.statistic.SaleAndProfitResponse;
import com.bac.se.backend.payload.response.statistic.StatisticResponse;
import com.bac.se.backend.payload.response.statistic.product.BestSellingProductResponse;
import com.bac.se.backend.payload.response.statistic.product.TopFiveHighestGrossingProductResponse;
import com.bac.se.backend.payload.response.statistic.sale.SaleAndProfitByMonth;
import com.bac.se.backend.payload.response.statistic.stock.*;
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
import java.time.LocalDate;
import java.util.*;

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
    private final StockMapper stockMapper;


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
    public List<SaleAndProfitByMonth> getSalesAndProfitByMonth(Integer month) {
        int currMonth = LocalDate.now().getMonthValue();
        int currYear = LocalDate.now().getYear();
        int size = 5;
        if(month != null ){
            if(month <= 12 && month >= 1){
                currMonth = month;
            }
        }
        if(currMonth == 2){
            size = 4;
        }
        Map<Integer,SaleAndProfitByMonth> map = new HashMap<>();
        for(int i = 0; i < size; i++){
            map.put(i+1,new SaleAndProfitByMonth("Tuần " + (i+1),BigDecimal.ZERO,BigDecimal.ZERO));
        }
        var salesAndProfitByMonth = orderItemRepository.getSalesAndProfitByMonth(currMonth,currYear)
                .stream().map(statisticMapper::mapObjectToSaleAndProfitByMonth).toList();
        for(SaleAndProfitByMonth saleAndProfitByMonth : salesAndProfitByMonth){
            SaleAndProfitByMonth res = map.get(Integer.parseInt(saleAndProfitByMonth.getWeek()));
            res.setWeek("Tuần " + saleAndProfitByMonth.getWeek());
            res.setTotalSales(saleAndProfitByMonth.getTotalSales());
            res.setTotalProfit(saleAndProfitByMonth.getTotalProfit());
        }

        return map.values().stream().toList();
    }


    @Override
    public List<ProductStockResponse> getStockByProduct(Integer month) {
        var soldQuantityProductByMonth = orderItemRepository.getSoldQuantityProductByMonth(month);
        var availableQuantityProduct = orderItemRepository.getAvailableQuantityProduct();
        var importQuantityProductByMonth = orderItemRepository.getImportQuantityProductByMonth(month);
        List<SoldQuantity> soldQuantityList = new ArrayList<>();
        List<AvailableQuantity> availableQuantityProductByMonthList = new ArrayList<>();
        List<ImportQuantity> importQuantityList = new ArrayList<>();
        Map<Long,ProductStockResponse> map = new HashMap<>();
        if(!soldQuantityProductByMonth.isEmpty()){
            soldQuantityList = soldQuantityProductByMonth
                    .stream()
                    .map(stockMapper::mapToSoldQuantity)
                    .toList();
        }
        for (SoldQuantity soldQuantity : soldQuantityList) {
            log.info("soldQuantity {}", soldQuantity);
        }
        if(!availableQuantityProduct.isEmpty()){
            availableQuantityProductByMonthList = availableQuantityProduct
                    .stream()
                    .map(stockMapper::mapToAvailableQuantity)
                    .toList();
        }
        if(!importQuantityProductByMonth.isEmpty()){
            importQuantityList = importQuantityProductByMonth
                    .stream()
                    .map(stockMapper::mapToImportQuantity)
                    .toList();
        }
        for(SoldQuantity soldQuantity : soldQuantityList){
            map.put(soldQuantity.id(),new ProductStockResponse(soldQuantity.name(),soldQuantity.quantity(),0,0));
        }
        for(AvailableQuantity availableQuantity : availableQuantityProductByMonthList){
            if(map.containsKey(availableQuantity.id())){
                map.get(availableQuantity.id()).setAvailableQuantity(availableQuantity.quantity());
            }
        }
        for(ImportQuantity importQuantity : importQuantityList){
            if(map.containsKey(importQuantity.id())){
                map.get(importQuantity.id()).setImportQuantity(importQuantity.quantity());
            }
        }
        return map.values().stream().filter(Objects::nonNull).toList();
    }

    @Override
    public List<ExpirationQuantity> getExpirationQuantity(Integer month, Integer year) {
        var expirationQuantityProductByMonthAndYear = orderItemRepository.getExpirationQuantityProductByMonthAndYear(month, year);
        if(!expirationQuantityProductByMonthAndYear.isEmpty()){
            return expirationQuantityProductByMonthAndYear
                    .stream()
                    .map(stockMapper::mapToExpirationQuantity)
                    .toList();
        }
        return List.of();
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
    public List<SaleAndProfitResponse> getSalesAndProfitInWeek(String toDate) throws ParseException {
        var dateRequest = dateConvert.generateDateInWeek(toDate);
        log.info("fromDate {}", dateRequest.fromDate());
        var responseMap = dateConvert.generateDateInWeekMap(toDate);

        var salesAndProfit = orderItemRepository.getSalesAndProfitByDate(dateRequest.fromDate(),dateRequest.toDate());
        var salesList =  salesAndProfit.stream().map(statisticMapper::mapObjectToSaleAndProfitResponse).toList();
        for(SaleAndProfitResponse profitResponse : salesList){
            responseMap.replace(profitResponse.getDate(),profitResponse);
        }
        return responseMap.values().stream().toList();
    }



}
