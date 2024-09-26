package com.bac.se.backend.services;

import com.bac.se.backend.enums.Role;
import com.bac.se.backend.exceptions.AlreadyExistsException;
import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.models.Account;
import com.bac.se.backend.models.Customer;
import com.bac.se.backend.payload.request.EmployeeAccountRequest;
import com.bac.se.backend.payload.request.LoginRequest;
import com.bac.se.backend.payload.request.RegisterRequest;
import com.bac.se.backend.payload.response.*;
import com.bac.se.backend.repositories.AccountRepository;
import com.bac.se.backend.repositories.CustomerRepository;
import com.bac.se.backend.repositories.EmployeeRepository;
import com.bac.se.backend.security.JWTService;
import com.bac.se.backend.utils.ValidateInput;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountService {
    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final JWTService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final EmployeeRepository employeeRepository;
    private final ValidateInput validateInput;

    private Account createAccountWithRole(String username, String password, Role role) {
        return Account.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .role(role)
                .build();
    }


    public ApiResponse getAccountResponse(String token) {
        Account account = accountRepository.findByUsername(token)
                .orElseThrow(() -> new ResourceNotFoundException("Not found user"));
        AccountResponse accountResponse = new AccountResponse(
                account.getUsername(),
                account.getRole().name());
        return new ApiResponse(
                "success",
                accountResponse
        );
    }

    //    create new customer
    public RegisterResponse registerCustomer(RegisterRequest registerRequest) throws BadRequestUserException {
        String email = registerRequest.email();
        String password = registerRequest.password();
        String name = registerRequest.name();
        String phone = registerRequest.phone();
        if (email.isEmpty() || password.isEmpty() || name.isEmpty() || phone.isEmpty()) {
            throw new BadRequestUserException("Input is required");
        }
        if (validateInput.isValidEmail(email)) {
            throw new BadRequestUserException("Email is not valid");
        }
        if (validateInput.isValidPhoneNumber(phone)) {
            throw new BadRequestUserException("Phone is not valid");
        }
        if(customerRepository.existsByEmail(email)){
            throw new AlreadyExistsException("Email already in use");
        }
        if(customerRepository.existsByPhone(phone)){
            throw new AlreadyExistsException("Phone already in use");
        }
        Account account = createAccountWithRole(email, password, Role.CUSTOMER);
        accountRepository.save(account);
        Customer customer = Customer.builder()
                .name(registerRequest.name())
                .email(registerRequest.email())
                .phone(registerRequest.phone())
                .account(account)
                .build();
        customerRepository.save(customer);
        String accessToken = jwtService.generateToken(account);
        log.info("Create customer success");
        return new RegisterResponse(
                accessToken,
                registerRequest.email()
        );
    }

    public EmployeeAccountResponse createAccountEmployee(EmployeeAccountRequest accountRequest) throws BadRequestUserException {
        if (accountRequest.email().isEmpty() || accountRequest.password().isEmpty() || accountRequest.confirmPassword().isEmpty()) {
            throw new BadRequestUserException("Input is required");
        }
        if (!accountRequest.password().equals(accountRequest.confirmPassword())) {
            throw new BadRequestUserException("Password and confirm password is not match");
        }
        if (employeeRepository.existsByEmail(accountRequest.email())) {
            throw new AlreadyExistsException("Email already in use");
        }
        Account account = createAccountWithRole(
                accountRequest.email(),
                accountRequest.password(),
                Role.EMPLOYEE);
        accountRepository.save(account);
        return new EmployeeAccountResponse(accountRequest.email(), accountRequest.email());
    }


    public LoginResponse loginUser(LoginRequest loginRequest) throws BadRequestUserException {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.username(),
                        loginRequest.password()
                )
        );
        if (loginRequest.username().isEmpty() || loginRequest.password().isEmpty()) {
            throw new BadRequestUserException("Username and password is required");
        }
        Account account = accountRepository.findByUsername(loginRequest.username())
                .orElseThrow(() -> new ResourceNotFoundException("Not found user"));
        String accessToken = jwtService.generateToken(account);
        String refreshToken = jwtService.generateRefreshToken(account);
        return new LoginResponse(
                accessToken,
                refreshToken
        );
    }


}
