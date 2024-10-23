package com.bac.se.backend.controllers;

import com.bac.se.backend.payload.response.common.ApiResponse;
import com.bac.se.backend.payload.response.product.StatisticPriceProductResponse;
import com.bac.se.backend.payload.response.statistic.StatisticResponse;
import com.bac.se.backend.services.StatisticService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/statistic")
@RequiredArgsConstructor
public class StatisticController {
    private final StatisticService statisticService;

    @GetMapping("/product")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<List<StatisticResponse>>> getStatisticByProduct() {
        try{
            return ResponseEntity.ok(new ApiResponse<>("success", statisticService.salesStatisticsByProduct()));
        }catch (Exception e){
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(),null));
        }
    }

    @GetMapping("/employee")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<List<StatisticResponse>>> getStatisticByEmployee() {
        try{
            return ResponseEntity.ok(new ApiResponse<>("success", statisticService.salesStatisticsByEmployee()));
        }catch (Exception e){
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(),null));
        }
    }

    @GetMapping("/product-price/{id}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<List<StatisticPriceProductResponse>>> getStatisticProductPricesByProduct(
           @PathVariable("id") Long productId) {
        try{
            return ResponseEntity.ok(new ApiResponse<>("success",
                    statisticService.statisticsProductPriceByTime(productId)));
        }catch (Exception e){
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(),null));
        }
    }
}
