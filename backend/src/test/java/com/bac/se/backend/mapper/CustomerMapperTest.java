package com.bac.se.backend.mapper;

import com.bac.se.backend.models.Customer;
import com.bac.se.backend.payload.response.CustomerResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CustomerMapperTest {

    CustomerMapper customerMapper = new CustomerMapper();


    @Test
    void mapToCustomerResponse() {
        Customer customer = new Customer();
        customer.setId(1L);
        customer.setName("John");
        customer.setEmail("john@gmail.com");
        customer.setPhone("123456789");
        CustomerResponse customerResponse = customerMapper.mapToCustomerResponse(customer);
        assertEquals(customer.getId(), customerResponse.id());
        assertEquals(customer.getName(), customerResponse.name());
        assertEquals(customer.getEmail(), customerResponse.email());
        assertEquals(customer.getPhone(), customerResponse.phone());
    }
}