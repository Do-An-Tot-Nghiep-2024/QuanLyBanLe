package com.bac.se.backend.services;

import com.bac.se.backend.enums.Role;
import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.models.Account;
import com.bac.se.backend.payload.request.EmployeeAccountRequest;
import com.bac.se.backend.payload.response.AccountResponse;
import com.bac.se.backend.repositories.AccountRepository;
import com.bac.se.backend.repositories.EmployeeRepository;
import com.bac.se.backend.utils.JwtParse;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;
    @InjectMocks
    private AccountService accountService;
    @Mock
    private JwtParse jwtParse;
    @Mock
    private HttpServletRequest request;
    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private Account account;
    private EmployeeAccountRequest employeeAccountRequest;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        account = new Account();
        account.setUsername("testUser");
        account.setPassword("testPassword");
        account.setRole(Role.EMPLOYEE);
        employeeAccountRequest = new EmployeeAccountRequest("testUser", "testPassword", "testPassword");
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
        assertEquals(token, response.token());
    }

    @Test
    void createAccountWithRole(){
        String name = "testUser";
        String password = "testPassword";
        Role role = Role.EMPLOYEE;
        Account account = accountService.createAccountWithRole(name, password, role);
        assertNotNull(account);
        assertEquals(name, account.getUsername());
        assertEquals(role, account.getRole());
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

//    @Test
//    void registerCustomer() {
//    }
//
    @Test
    void createAccountEmployee() throws BadRequestUserException {

    }
//
//    @Test
//    void loginUser() {
//    }
}