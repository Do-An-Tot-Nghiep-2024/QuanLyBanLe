package com.bac.se.backend.controllers;

import com.bac.se.backend.payload.response.common.ApiResponse;
import com.bac.se.backend.payload.response.statistic.DashboardEmpResponse;
import com.bac.se.backend.payload.response.statistic.DashboardResponse;
import com.bac.se.backend.services.DashboardService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        try{
            return ResponseEntity.ok(new ApiResponse<>("success", dashboardService.getDashboard()));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/employee")
    @PreAuthorize("hasAuthority('EMPLOYEE')")
    public ResponseEntity<ApiResponse<DashboardEmpResponse>> getDashboardEmp(HttpServletRequest request,
                                                                             @RequestParam(required = false) String fromDate,
                                                                             @RequestParam(required = false) String toDate) {
        try {
            return ResponseEntity.ok(new ApiResponse<>("success", dashboardService.getDashboardEmp(request, fromDate, toDate)));
        } catch (ParseException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>("Invalid date format. Please use 'yyyy-MM-dd'.", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}
