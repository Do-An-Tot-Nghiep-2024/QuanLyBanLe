package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.models.Customer;
import com.bac.se.backend.payload.response.CustomerResponse;
import com.bac.se.backend.repositories.CustomerRepository;
import com.bac.se.backend.utils.ValidateInput;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class CustomerServiceTest {


    @InjectMocks
    private CustomerService customerService;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private ValidateInput validateInput;


    Customer customer = null;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        customer = Customer.builder()
                .id(1L)
                .name("John Doe")
                .email("john@gmail.com")
                .phone("0123456789")
                .build();
    }

    @Test
    void mapToCustomerResponse() {
        CustomerResponse customerResponse = customerService.mapToCustomerResponse(customer);
        assertEquals(customer.getId(), customerResponse.id());
        assertEquals(customer.getName(), customerResponse.name());
        assertEquals(customer.getEmail(), customerResponse.email());
        assertEquals(customer.getPhone(), customerResponse.phone());
    }

    @Test
    void getCustomers() {

    }

    @Test
    void getCustomerSuccess() {
        when(customerRepository.getCustomerByEmail("john@gmail.com")).thenReturn(Optional.of(customer));
        CustomerResponse customerResponse = customerService.getCustomer("john@gmail.com");
        assertEquals(customer.getId(), customerResponse.id());
        assertEquals(customer.getName(), customerResponse.name());
        assertEquals(customer.getEmail(), customerResponse.email());
        assertEquals(customer.getPhone(), customerResponse.phone());
        verify(customerRepository).getCustomerByEmail(anyString());
    }

    @Test
    void deleteCustomer() {
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(customerRepository.save(customer)).thenReturn(customer);
        customerService.deleteCustomer(1L);
        assertFalse(customer.isActive());
        verify(customerRepository).findById(1L);
        verify(customerRepository).save(customer);
    }

    @Test
    void deleteCustomerNotFound() {
        when(customerRepository.findById(1L)).thenReturn(Optional.empty());
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> customerService.deleteCustomer(1L));
        assertEquals("Không tìm thấy khách hàng", exception.getMessage());
        verify(customerRepository).findById(1L);
        verify(customerRepository, never()).save(any());
    }

    @Test
    void updateCustomer() throws BadRequestUserException {
        when(validateInput.isValidEmail(customer.getEmail())).thenReturn(true);
        when(validateInput.isValidPhoneNumber(customer.getPhone())).thenReturn(true);
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(customerRepository.save(customer)).thenReturn(customer);
        CustomerResponse customerResponse = customerService.updateCustomer(customer, 1L);
        assertEquals(customer.getId(), customerResponse.id());
        assertEquals(customer.getName(), customerResponse.name());
        assertEquals(customer.getEmail(), customerResponse.email());
        assertEquals(customer.getPhone(), customerResponse.phone());
        verify(customerRepository).findById(1L);
        verify(customerRepository).save(customer);
    }

    @Test
    void updateCustomerInvalidInput() throws BadRequestUserException {
        // Mock the customer and dependencies
        Customer customer = mock(Customer.class);  // Ensure customer is mocked
        ValidateInput validateInput = mock(ValidateInput.class);

        // Stubbing method calls on the mock object
        when(customer.getName()).thenReturn("");
        when(validateInput.isValidEmail(customer.getEmail())).thenReturn(false);
        when(validateInput.isValidPhoneNumber(customer.getPhone())).thenReturn(false);

        // Test that the correct exception is thrown
        BadRequestUserException exception = assertThrows(BadRequestUserException.class,
                () -> customerService.updateCustomer(customer, 1L));
        assertEquals("Vui lòng nhập đầy đủ thông tin", exception.getMessage());

        // Verify that save() is never called on the repository
        verify(customerRepository, never()).save(any());
    }

    @Test
    void updateCustomerWithInvalidEmail() throws BadRequestUserException {
        when(validateInput.isValidEmail(customer.getEmail())).thenReturn(false);
        Exception exception = assertThrows(BadRequestUserException.class,
                () -> customerService.updateCustomer(customer, 1L));
        assertEquals("Email không hợp lệ", exception.getMessage());
        verify(customerRepository, never()).findById(anyLong());
        verify(customerRepository, never()).save(any());
    }

    @Test
    void updateCustomerWithInvalidPhone() throws BadRequestUserException {
        when(validateInput.isValidPhoneNumber(customer.getPhone())).thenReturn(false);
        Exception exception = assertThrows(BadRequestUserException.class,
                () -> customerService.updateCustomer(customer, 1L));
        assertEquals("Email không hợp lệ", exception.getMessage());
        verify(customerRepository, never()).findById(anyLong());
        verify(customerRepository, never()).save(any());
    }


    @Test
    void updateCustomerNotFound() {
        when(validateInput.isValidEmail(customer.getEmail())).thenReturn(true);
        when(validateInput.isValidPhoneNumber(customer.getPhone())).thenReturn(true);
        when(customerRepository.findById(1L)).thenReturn(Optional.empty());
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> customerService.updateCustomer(customer, 1L));
        assertEquals("Không tìm thấy khách hàng", exception.getMessage());
        verify(customerRepository).findById(1L);
        verify(customerRepository, never()).save(any());
    }
}