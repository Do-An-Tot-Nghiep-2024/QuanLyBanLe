package com.bac.se.backend.services;

import com.bac.se.backend.enums.Role;
import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.models.Account;
import com.bac.se.backend.payload.request.EmployeeAccountRequest;
import com.bac.se.backend.payload.request.LoginRequest;
import com.bac.se.backend.payload.response.AccountResponse;
import com.bac.se.backend.payload.response.LoginResponse;
import com.bac.se.backend.repositories.AccountRepository;
import com.bac.se.backend.security.JWTService;
import com.bac.se.backend.services.impl.AccountServiceImpl;
import com.bac.se.backend.utils.JwtParse;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;
    @InjectMocks
    private AccountServiceImpl accountService;
    @Mock
    private JwtParse jwtParse;
    @Mock
    private HttpServletRequest request;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JWTService jwtService;

    @Mock
    private PasswordEncoder passwordEncoder;

    Account account;
    EmployeeAccountRequest employeeAccountRequest;
    LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        account = new Account();
        account.setUsername("testUser");
        account.setPassword("testPassword");
        account.setRole(Role.EMPLOYEE);
        employeeAccountRequest = new EmployeeAccountRequest("testUser", "testPassword", "testPassword");
        loginRequest = new LoginRequest("testUser", "testPassword");
    }

    @Test
    void getAccountResponseSuccess() {
        String token = "testToken";
        String accessToken = "testUser";
        when(jwtParse.parseJwt(request)).thenReturn(token);
        when(jwtParse.decodeTokenWithRequest(request)).thenReturn(accessToken);
        when(accountRepository.findByUsername(accessToken)).thenReturn(Optional.of(account));
        AccountResponse response = accountService.getAccountResponse(request);
        assertNotNull(response);
        assertEquals("testUser", response.username());
        assertEquals("EMPLOYEE", response.role());
    }

    @Test
    void createAccountWithRole() {
        String name = "testUser";
        String password = "testPassword";
        Role role = Role.EMPLOYEE;
        Account account = accountService.createAccountWithRole(name, password, role);
        assertNotNull(account);
        assertEquals(name, account.getUsername());
        assertEquals(role, account.getRole());
        verify(passwordEncoder, times(1)).encode(password);
    }

    @Test
    void testGetAccountResponse_AccountNotFound() {
        // Arrange
        String token = "invalidUsername";
        when(jwtParse.decodeTokenWithRequest(request)).thenReturn(token);
        when(accountRepository.findByUsername(token)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException thrown = assertThrows(
                ResourceNotFoundException.class,
                () -> accountService.getAccountResponse(request),
                "Expected getAccountResponse() to throw ResourceNotFoundException"
        );
        assertEquals("Not found user", thrown.getMessage());
    }

    @Test
    void registerCustomer() {

    }

    //
    @Test
    void createAccountEmployee() throws BadRequestUserException {

    }

    @Test
    void loginUser() throws BadRequestUserException {
        LoginRequest loginRequest = new LoginRequest("john_doe", "password123");
        Account account = new Account(1L, "john_doe", "password123", Role.CUSTOMER);

        when(accountRepository.findByUsername(loginRequest.username())).thenReturn(Optional.of(account));
        when(jwtService.generateToken(account)).thenReturn("access_token");
        when(jwtService.generateRefreshToken(account)).thenReturn("refresh_token");

        // Act
        LoginResponse loginResponse = accountService.loginUser(loginRequest);

        // Assert
        assertNotNull(loginResponse);
        assertEquals("access_token", loginResponse.accessToken());
        assertEquals("refresh_token", loginResponse.refreshToken());
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(accountRepository, times(1)).findByUsername(loginRequest.username());
        verify(jwtService, times(1)).generateToken(account);
        verify(jwtService, times(1)).generateRefreshToken(account);
    }

    @Test
    void loginUserWithInputEmpty() {
        // Arrange
        LoginRequest loginRequestEmpty = new LoginRequest("john_doe", "");
        // Act & Assert
        BadRequestUserException thrown = assertThrows(BadRequestUserException.class, () -> {
            accountService.loginUser(loginRequestEmpty);
        });

        assertEquals("Username and password is required", thrown.getMessage());
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(accountRepository, never()).findByUsername(anyString());
        verify(jwtService, never()).generateToken(any(Account.class));
        verify(jwtService, never()).generateRefreshToken(any(Account.class));
    }

    @Test
    void loginUserWithInvalidUsername() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest("john_doe", "password123");

        when(accountRepository.findByUsername(loginRequest.username())).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException thrown = assertThrows(ResourceNotFoundException.class, () -> {
            accountService.loginUser(loginRequest);
        });

        assertEquals("Tên đăng nhập hoặc mật khẩu không đúng", thrown.getMessage());
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(accountRepository, times(1)).findByUsername(loginRequest.username());
        verify(jwtService, never()).generateToken(any(Account.class));
        verify(jwtService, never()).generateRefreshToken(any(Account.class));
    }
}