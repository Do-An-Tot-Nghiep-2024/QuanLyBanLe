package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.models.Customer;
import com.bac.se.backend.payload.response.CustomerResponse;
import com.bac.se.backend.payload.response.common.PageResponse;

public interface CustomerService {
    PageResponse<CustomerResponse> getCustomers(Integer pageNumber, Integer pageSize);

    CustomerResponse getCustomer(String email);

    CustomerResponse updateCustomer(Customer customer, Long id) throws BadRequestUserException;
}
