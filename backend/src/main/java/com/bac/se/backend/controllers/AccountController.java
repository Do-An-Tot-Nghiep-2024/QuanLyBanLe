package com.bac.se.backend.controllers;

import com.bac.se.backend.exceptions.AlreadyExistsException;
import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.payload.request.EmployeeAccountRequest;
import com.bac.se.backend.payload.request.LoginRequest;
import com.bac.se.backend.payload.request.RegisterRequest;
import com.bac.se.backend.payload.response.ApiResponse;
import com.bac.se.backend.payload.response.EmployeeAccountResponse;
import com.bac.se.backend.payload.response.LoginResponse;
import com.bac.se.backend.payload.response.RegisterResponse;
import com.bac.se.backend.services.AccountService;
import com.bac.se.backend.utils.JwtParse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AccountController {
    private final AccountService accountService;
    private final JwtParse jwtParse;

    // Register account customer controller
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request) {
       try {
           RegisterResponse registerResponse = accountService.registerCustomer(request);
           return ResponseEntity.ok()
                   .body(new ApiResponse("success",registerResponse));
       } catch (BadRequestUserException e) {
           return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                   .body(new ApiResponse(e.getMessage(),null));
       }catch (AlreadyExistsException e){
           return ResponseEntity.status(HttpStatus.CONFLICT)
                   .body(new ApiResponse(e.getMessage(),null));
       }
    }

    @PostMapping("/createAccount")
    public ResponseEntity<ApiResponse> createAccountEmployee(@RequestBody EmployeeAccountRequest accountRequest)  {
        log.info("Request is {}", accountRequest);
        try {
            EmployeeAccountResponse accountEmployee = accountService.createAccountEmployee(accountRequest);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse("success",accountEmployee));
        } catch (BadRequestUserException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(),null));
        }catch (AlreadyExistsException e){
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse(e.getMessage(),null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse login = accountService.loginUser(loginRequest);
            return ResponseEntity
                    .ok()
//                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(new ApiResponse("success", login));
        } catch (BadRequestUserException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), null));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(e.getMessage(), null));
        }
    }


    @GetMapping("/account")
    public ResponseEntity<ApiResponse> getAccount(HttpServletRequest request) {
        try {
            String accessToken = jwtParse.decodeTokenWithRequest(request);
            log.info("token user is {}", accessToken);
            return ResponseEntity.ok(accountService.getAccountResponse(accessToken));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), null));
        }

    }

}
