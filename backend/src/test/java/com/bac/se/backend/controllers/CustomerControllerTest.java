package com.bac.se.backend.controllers;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.models.Customer;
import com.bac.se.backend.payload.response.CustomerResponse;
import com.bac.se.backend.payload.response.common.ApiResponse;
import com.bac.se.backend.services.CustomerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class CustomerControllerTest {

    @InjectMocks
    private CustomerController customerController;

    @Mock
    private CustomerService customerService;




    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }


    @Test
    @WithMockUser(authorities = "CUSTOMER")
    public void updateCustomer_ValidInput_ReturnsSuccess() throws BadRequestUserException {
        Customer customer = new Customer(); // Assuming a default constructor exists
        Long id = 1L;
        CustomerResponse expectedResponse = mock(CustomerResponse.class);
        when(customerService.updateCustomer(customer, id)).thenReturn(expectedResponse);
        // Act
        ResponseEntity<ApiResponse<CustomerResponse>> response = customerController.updateCustomer(customer, id);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", Objects.requireNonNull(response.getBody()).getMessage());
        assertEquals(expectedResponse, response.getBody().getData());
    }

    @Test
    @WithMockUser(authorities = "CUSTOMER")
    public void updateCustomer_ExceptionThrown_ReturnsBadRequest() throws BadRequestUserException {
        Customer customer = new Customer(); // Assuming a default constructor exists
        Long id = 1L;
        when(customerService.updateCustomer(customer, id)).thenThrow(new RuntimeException("Update failed"));

        // Act
        ResponseEntity<ApiResponse<CustomerResponse>> response = customerController.updateCustomer(customer, id);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Update failed", Objects.requireNonNull(response.getBody()).getMessage());
        assertNull(response.getBody().getData());
    }

}