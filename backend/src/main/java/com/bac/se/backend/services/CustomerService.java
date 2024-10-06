package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.models.Customer;
import com.bac.se.backend.payload.response.CustomerResponse;

import java.util.List;

public interface CustomerService {
    List<CustomerResponse> getCustomers();
    CustomerResponse getCustomer(String email);
    CustomerResponse updateCustomer(Customer customer, Long id) throws BadRequestUserException;
}
