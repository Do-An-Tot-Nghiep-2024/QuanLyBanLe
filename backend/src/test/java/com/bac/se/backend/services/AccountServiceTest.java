package com.bac.se.backend.services;

import com.bac.se.backend.enums.Role;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.models.Account;
import com.bac.se.backend.payload.response.AccountResponse;
import com.bac.se.backend.payload.response.ApiResponse;
import com.bac.se.backend.repositories.AccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;
    @InjectMocks
    private AccountService accountService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    @Test
    void getAccountResponseSuccess() {
        String token = "validUsername";
        Account mockAccount = new Account();
        mockAccount.setUsername("validUsername");
        mockAccount.setRole(Role.EMPLOYEE); // Assuming Role is an enum
        when(accountRepository.findByUsername(token)).thenReturn(Optional.of(mockAccount));

        // Act
        ApiResponse response = accountService.getAccountResponse(token);
        // Assert
        assertEquals("success", response.message());
        assertNotNull(response.data());
        AccountResponse accountResponse = (AccountResponse) response.data();
        assertEquals("validUsername", accountResponse.username());
        assertEquals(Role.EMPLOYEE.name(), accountResponse.role());
    }

    @Test
    void testGetAccountResponse_AccountNotFound() {
        // Arrange
        String token = "invalidUsername";
        when(accountRepository.findByUsername(token)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException thrown = assertThrows(
                ResourceNotFoundException.class,
                () -> accountService.getAccountResponse(token),
                "Expected getAccountResponse() to throw ResourceNotFoundException"
        );
        assertEquals("Not found user", thrown.getMessage());
    }

    // @Test
    // void testRegisterCustomer_Success() throws BadRequestUserException {
    //     // Arrange
    //     RegisterRequest registerRequest = new RegisterRequest("validemail@example.com", "password", "John Doe", "1234567890");
    //     Account account = Account.builder()
    //             .username("validemail@example.com")
    //             .password(passwordEncoder.encode("password"))
    //             .role(Role.CUSTOMER)
    //             .build();
    //     Customer customer = Customer.builder()
    //             .email("validemail@example.com")
    //             .name("John Doe")
    //             .phone("1234567890")
    //             .account(account)
    //             .build();

    //     when(validateInput.isValidEmail("validemail@example.com")).thenReturn(false); // valid email
    //     when(validateInput.isValidPhoneNumber("1234567890")).thenReturn(false); // valid phone number
    //     when(customerRepository.existsByEmail("validemail@example.com")).thenReturn(false);
    //     when(customerRepository.existsByPhone("1234567890")).thenReturn(false);
    //     when(accountRepository.save(any(Account.class))).thenReturn(account);
    //     when(customerRepository.save(any(Customer.class))).thenReturn(customer);
    //     when(jwtService.generateToken(account)).thenReturn("generatedToken");

    //     // Act
    //     RegisterResponse response = accountService.registerCustomer(registerRequest);

    //     // Assert
    //     assertEquals("generatedToken", jwtService.extractUsername(response.accessToken()));
    //     assertEquals("validemail@example.com", response.email());
    //     verify(accountRepository, times(1)).save(any(Account.class));
    //     verify(customerRepository, times(1)).save(any(Customer.class));
    //     verify(jwtService, times(1)).generateToken(account);
    // }

    @Test
    void registerCustomer() {
    }

    @Test
    void createAccountEmployee() {
    }

    @Test
    void loginUser() {
    }
}