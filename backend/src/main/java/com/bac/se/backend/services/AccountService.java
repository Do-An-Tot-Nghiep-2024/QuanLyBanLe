package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.payload.request.ChangePasswordRequest;
import com.bac.se.backend.payload.request.EmployeeAccountRequest;
import com.bac.se.backend.payload.request.LoginRequest;
import com.bac.se.backend.payload.request.RegisterRequest;
import com.bac.se.backend.payload.response.auth.AccountResponse;
import com.bac.se.backend.payload.response.auth.LoginResponse;
import com.bac.se.backend.payload.response.auth.RegisterResponse;
import com.bac.se.backend.payload.response.employee.EmployeeAccountResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface AccountService {

    AccountResponse getAccountResponse(HttpServletRequest request);

    RegisterResponse registerCustomer(RegisterRequest registerRequest) throws BadRequestUserException;

    EmployeeAccountResponse createAccountEmployee(EmployeeAccountRequest accountRequest) throws BadRequestUserException;

    LoginResponse loginUser(LoginRequest loginRequest) throws BadRequestUserException;

    LoginResponse resetPassword(String email,String newPassword,String confirmPassword) throws BadRequestUserException;

    String changePassword(ChangePasswordRequest changePasswordRequest,HttpServletRequest request) throws BadRequestUserException;
}
