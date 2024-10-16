package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.mapper.CustomerMapper;
import com.bac.se.backend.models.Customer;
import com.bac.se.backend.payload.response.CustomerResponse;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.repositories.CustomerRepository;
import com.bac.se.backend.services.impl.CustomerServiceImpl;
import com.bac.se.backend.utils.ValidateInput;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class CustomerServiceTest {


    @InjectMocks
    private CustomerServiceImpl customerService;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private ValidateInput validateInput;

    @Mock
    private CustomerMapper customerMapper;


    Customer customer = null;
    CustomerResponse customerResponse = null;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        customer = Customer.builder()
                .id(1L)
                .name("John Doe")
                .email("john@gmail.com")
                .phone("0123456789")
                .build();
        customerResponse = new CustomerResponse(1L, "John Doe", "john@gmail.com", "0123456789");
    }



    @Test
    void getCustomers() {
        Pageable pageable = PageRequest.of(0, 10);
        List<Object[]> customerData = List.of(
                new Object[]{1L, "John Doe", "john@example.com", "1234567890"},
                new Object[]{2L, "Jane Doe", "jane@example.com", "0987654321"}
        );
        Page<Object[]> customerPage = new PageImpl<>(customerData, pageable, customerData.size());
        when(customerRepository.getCustomers(pageable)).thenReturn(customerPage);
        // Act
        PageResponse<CustomerResponse> response = customerService.getCustomers(0, 10);
        // Assert
        assertEquals(2, response.getTotalElements());
        assertEquals("John Doe", response.getResponseList().get(0).name());
        assertEquals("Jane Doe", response.getResponseList().get(1).name());

    }

    @Test
    void getCustomerSuccess() {
        when(customerRepository.getCustomerByEmail("john@gmail.com")).thenReturn(Optional.of(customer));
        when(customerMapper.mapToCustomerResponse(customer)).thenReturn(customerResponse);
        CustomerResponse customerResponse = customerService.getCustomer("john@gmail.com");
        assertEquals(customer.getId(), customerResponse.id());
        assertEquals(customer.getName(), customerResponse.name());
        assertEquals(customer.getEmail(), customerResponse.email());
        assertEquals(customer.getPhone(), customerResponse.phone());
        verify(customerRepository).getCustomerByEmail(anyString());
    }

    @Test
    void getCustomerNotFound() {
        when(customerRepository.getCustomerByEmail("john@gmail.com")).thenReturn(Optional.empty());
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> customerService.getCustomer("john@gmail.com"));
        assertEquals("Không tìm thấy khách hàng", exception.getMessage());
        verify(customerRepository).getCustomerByEmail(anyString());
    }

    @Test
    void updateCustomer() throws BadRequestUserException {
        when(validateInput.isValidEmail(customer.getEmail())).thenReturn(true);
        when(validateInput.isValidPhoneNumber(customer.getPhone())).thenReturn(true);
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(customerRepository.save(customer)).thenReturn(customer);
        when(customerMapper.mapToCustomerResponse(customer)).thenReturn(customerResponse);
        CustomerResponse customerResponse = customerService.updateCustomer(customer, 1L);
        assertEquals(customer.getId(), customerResponse.id());
        assertEquals(customer.getName(), customerResponse.name());
        assertEquals(customer.getEmail(), customerResponse.email());
        assertEquals(customer.getPhone(), customerResponse.phone());
        verify(customerRepository).findById(1L);
        verify(customerRepository).save(customer);
    }

    @Test
    void updateCustomerInvalidInput() {
        // Mock the customer and dependencies
        Customer customer = mock(Customer.class);  // Ensure customer is mocked
        ValidateInput validateInput = mock(ValidateInput.class);

        // Stubbing method calls on the mock object
        when(customer.getName()).thenReturn("");
        when(customer.getEmail()).thenReturn("john@gmail.com");
        when(customer.getPhone()).thenReturn("0123456789");
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
    void updateCustomerWithInvalidEmail(){
        when(validateInput.isValidEmail(customer.getEmail())).thenReturn(false);
        Exception exception = assertThrows(BadRequestUserException.class,
                () -> customerService.updateCustomer(customer, 1L));
        assertEquals("Email không hợp lệ", exception.getMessage());
        verify(customerRepository, never()).findById(anyLong());
        verify(customerRepository, never()).save(any());
    }

    @Test
    void updateCustomerWithInvalidPhone()  {
        Customer customer = Customer.builder()
                .email("john@gmail.com")
                .phone("0123456789")
                .name("John Doe")
                .build();
        when(validateInput.isValidEmail(customer.getEmail())).thenReturn(true);
        when(validateInput.isValidPhoneNumber(customer.getPhone())).thenReturn(false);

        // Act & Assert
        BadRequestUserException thrown = assertThrows(BadRequestUserException.class, () -> customerService.validateInput(customer));

        assertEquals("Số điện thoại không hợp lệ", thrown.getMessage());
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