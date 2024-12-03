package com.bac.se.backend.controllers;

import com.bac.se.backend.payload.response.common.ApiResponse;
import com.bac.se.backend.payload.response.common.OrderDateResponse;
import com.bac.se.backend.payload.response.product.StatisticPriceProductResponse;
import com.bac.se.backend.payload.response.statistic.SaleAndProfitResponse;
import com.bac.se.backend.payload.response.statistic.StatisticResponse;
import com.bac.se.backend.payload.response.statistic.product.BestSellingProductResponse;
import com.bac.se.backend.payload.response.statistic.product.TopFiveHighestGrossingProductResponse;
import com.bac.se.backend.payload.response.statistic.sale.SaleAndProfitByMonth;
import com.bac.se.backend.payload.response.statistic.stock.ExpirationQuantity;
import com.bac.se.backend.payload.response.statistic.stock.ProductStockResponse;
import com.bac.se.backend.services.StatisticService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/statistic")
@RequiredArgsConstructor
public class StatisticController {
    private final StatisticService statisticService;

    @GetMapping("/product")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<List<StatisticResponse>>> getStatisticByProduct() {
        try {
            return ResponseEntity.ok(new ApiResponse<>("success", statisticService.salesStatisticsByProduct()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/employee")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<List<StatisticResponse>>> getStatisticByEmployee() {
        try {
            return ResponseEntity.ok(new ApiResponse<>("success", statisticService.salesStatisticsByEmployee()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/product-price/{id}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<List<StatisticPriceProductResponse>>> getStatisticProductPricesByProduct(
            @PathVariable("id") Long productId) {
        try {
            return ResponseEntity.ok(new ApiResponse<>("success",
                    statisticService.statisticsProductPriceByTime(productId)));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/best-selling-product")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<List<BestSellingProductResponse>>> getStatisticBestSellingProduct(
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate
    ) {
        try {
            return ResponseEntity.ok(new ApiResponse<>("success",
                    statisticService.statisticsBestSellingProduct(fromDate, toDate)));
        } catch (ParseException e) {
            return ResponseEntity.status(400).body(new ApiResponse<>("Invalid date format. Please use 'yyyy-MM-dd'.", null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    // Get sale and profit by month
    @GetMapping("/sale-and-profit-by-month")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<List<SaleAndProfitByMonth>>> getStatisticSaleAndProfit(
            @RequestParam(required = false) Integer month
    ) {
        try {
            return ResponseEntity.ok(new ApiResponse<>("success",
                    statisticService.getSalesAndProfitByMonth(month)));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/sale-and-profit-in-week")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<List<SaleAndProfitResponse>>> getStatisticSaleAndProfit(
            @RequestParam(required = false) String toDate
    ) {
        try {
            return ResponseEntity.ok(new ApiResponse<>("success",
                    statisticService.getSalesAndProfitInWeek(toDate)));
        }catch (ParseException e) {
            return ResponseEntity.status(400).body(new ApiResponse<>("Invalid date format. Please use 'yyyy-MM-dd'.", null));
        }
        catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }


    // Get top five highest grossing product
    @GetMapping("/top-five-highest-grossing-product")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<List<TopFiveHighestGrossingProductResponse>>> getStatisticTopFiveHighestGrossingProduct(
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate
    ) {
        try {
            return ResponseEntity.ok(new ApiResponse<>("success",
                    statisticService.statisticsTopFiveHighestGrossingProduct(fromDate, toDate)));
        } catch (ParseException e) {
            return ResponseEntity.status(400).body(new ApiResponse<>("Invalid date format. Please use 'yyyy-MM-dd'.", null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    // Get statistics by supplier
    @GetMapping("/supplier")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<List<StatisticResponse>>> getStatisticBySupplier() {
        try {
            return ResponseEntity.ok(new ApiResponse<>("success",
                    statisticService.statisticsBySupplier()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    // statistics employee
    // total sales
    @GetMapping("/employee/total-sales")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<List<OrderDateResponse<BigDecimal>>>> getTotalSalesByEmp(HttpServletRequest request,
                                                                                               @RequestParam(required = false) String fromDate,
                                                                                               @RequestParam(required = false) String toDate) {
        try {
            return ResponseEntity.ok(new ApiResponse<>("success",
                    statisticService.getTotalSalesByEmp(request, fromDate, toDate)));
        } catch (ParseException e) {
            return ResponseEntity.status(400).body(new ApiResponse<>("Invalid date format. Please use 'yyyy-MM-dd'.", null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    // total orders
    @GetMapping("/employee/total-orders")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<List<OrderDateResponse<Integer>>>> getTotalOrdersByEmp(HttpServletRequest request,
                                                                                             @RequestParam(required = false) String fromDate,
                                                                                             @RequestParam(required = false) String toDate) {
        try {
            return ResponseEntity.ok(new ApiResponse<>("success",
                    statisticService.getCurrentTotalOrdersOfEmployee(request, fromDate, toDate)));
        } catch (ParseException e) {
            return ResponseEntity.status(400).body(new ApiResponse<>("Invalid date format. Please use 'yyyy-MM-dd'.", null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    // Get stock by product
    @GetMapping("/stock-by-product")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<List<ProductStockResponse>>> getStockByProduct(
            @RequestParam(required = false) Integer month) {
        try {
            return ResponseEntity.ok(new ApiResponse<>("success",
                    statisticService.getStockByProduct(month)));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/expiration-quantity")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE','MANAGER')")
    public ResponseEntity<ApiResponse<List<ExpirationQuantity>>> getSaleAndProfit(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        try {
            return ResponseEntity.ok(new ApiResponse<>("success",
                    statisticService.getExpirationQuantity(month,year)));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}
