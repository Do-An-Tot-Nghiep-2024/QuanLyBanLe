package com.bac.se.backend.controllers;

import com.bac.se.backend.exceptions.AlreadyExistsException;
import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.payload.request.ChangePasswordRequest;
import com.bac.se.backend.payload.request.EmployeeAccountRequest;
import com.bac.se.backend.payload.request.LoginRequest;
import com.bac.se.backend.payload.request.RegisterRequest;
import com.bac.se.backend.payload.response.auth.AccountResponse;
import com.bac.se.backend.payload.response.auth.LoginResponse;
import com.bac.se.backend.payload.response.auth.RegisterResponse;
import com.bac.se.backend.payload.response.common.ApiResponse;
import com.bac.se.backend.payload.response.employee.EmployeeAccountResponse;
import com.bac.se.backend.services.AccountService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AccountController {
    private final AccountService accountService;
    static final String REQUEST_SUCCESS = "success";

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(@RequestBody RegisterRequest request) {
        try {
            RegisterResponse registerResponse = accountService.registerCustomer(request);
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, registerResponse));
        } catch (BadRequestUserException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(e.getMessage(), null));
        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @PostMapping("/createAccount")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<EmployeeAccountResponse>> createAccountEmployee(@RequestBody EmployeeAccountRequest accountRequest) {
        log.info("Request is {}", accountRequest);
        try {
            EmployeeAccountResponse accountEmployee = accountService.createAccountEmployee(accountRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(REQUEST_SUCCESS, accountEmployee));
        } catch (BadRequestUserException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(e.getMessage(), null));
        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse login = accountService.loginUser(loginRequest);
            log.info("Login user is {}", login);
            return ResponseEntity.ok().body(new ApiResponse<>(REQUEST_SUCCESS, login));
        } catch (BadRequestUserException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(e.getMessage(), null));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/account")
    public ResponseEntity<ApiResponse<AccountResponse>> getAccount(HttpServletRequest request) {
        try {
            log.info("token user is {}", request.getHeader("Authorization"));
            return ResponseEntity.ok(new ApiResponse<>(REQUEST_SUCCESS, accountService.getAccountResponse(request)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<LoginResponse>> resetPassword(
            @Param("email") String email,
            @RequestParam("newPassword") String newPassword,
            @RequestParam("confirmPassword") String confirmPassword) {
        try {
            LoginResponse login = accountService.resetPassword(email, newPassword, confirmPassword);
            return ResponseEntity.ok().body(new ApiResponse<>(REQUEST_SUCCESS, login));
        } catch (BadRequestUserException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @RequestBody ChangePasswordRequest changePasswordRequest,
            HttpServletRequest request) {
        try {
            String result = accountService.changePassword(changePasswordRequest, request);
            return ResponseEntity.ok().body(new ApiResponse<>(REQUEST_SUCCESS, result));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(e.getMessage(), null));
        } catch (BadRequestUserException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}