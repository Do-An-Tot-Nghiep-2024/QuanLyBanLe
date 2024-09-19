package com.bac.se.backend.controllers;


import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.models.Customer;
import com.bac.se.backend.payload.response.ApiResponse;
import com.bac.se.backend.payload.response.CustomerResponse;
import com.bac.se.backend.security.JWTService;
import com.bac.se.backend.services.CustomerService;
import com.bac.se.backend.utils.JwtParse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
@Slf4j
public class CustomerController {
    private final CustomerService customerService;
    private final JwtParse jwtParse;
    @GetMapping
    @PreAuthorize("hasAuthority('MANAGER')")
    public List<CustomerResponse> getCustomers() {
       return customerService.getCustomers();
    }

    @GetMapping("/detail")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<ApiResponse> getCustomer(HttpServletRequest request) {
        try {
            String accessToken  = jwtParse.decodeTokenWithRequest(request);
            CustomerResponse customerResponse = customerService.getCustomer(accessToken);
            return ResponseEntity.ok(new ApiResponse("success", customerResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(e.getMessage(), null));
        }
    }

    @DeleteMapping("/delete")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse> deleteCustomer(@PathVariable("id") Long id) {
        try {
            customerService.deleteCustomer(id);
            return ResponseEntity.ok(new ApiResponse("success", id));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PutMapping("/update")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public CustomerResponse updateCustomer(Customer customer, Long id) {
        return customerService.updateCustomer(customer, id);
    }

}