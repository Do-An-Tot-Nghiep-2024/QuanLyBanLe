package com.bac.se.backend.services.impl;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.mapper.CustomerMapper;
import com.bac.se.backend.models.Customer;
import com.bac.se.backend.payload.response.CustomerResponse;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.repositories.CustomerRepository;
import com.bac.se.backend.services.CustomerService;
import com.bac.se.backend.utils.ValidateInput;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository customerRepository;
    private final ValidateInput validateInput;
    private final CustomerMapper customerMapper;
    static final String CUSTOMER_NOT_FOUND = "Không tìm thấy khách hàng";

    public void validateInput(Customer customer) throws BadRequestUserException {
        if (customer.getName().isEmpty() || customer.getEmail().isEmpty() || customer.getPhone().isEmpty()) {
            throw new BadRequestUserException("Vui lòng nhập đầy đủ thông tin");
        }
        if (!validateInput.isValidEmail(customer.getEmail())) {
            throw new BadRequestUserException("Email không hợp lệ");
        }
        if (!validateInput.isValidPhoneNumber(customer.getPhone())) {
            throw new BadRequestUserException("Số điện thoại không hợp lệ");
        }
    }


    @Override
    public PageResponse<CustomerResponse> getCustomers(Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Object[]> customerPage = customerRepository.getCustomers(pageable);
        List<Object[]> customerList = customerPage.getContent();
        var list = customerList.stream().map(objects -> new CustomerResponse(Long.valueOf(objects[0].toString()),// customer_id
                (String) objects[1],                   // name
                (String) objects[2],                   // email
                (String) objects[3]                    // phone
        )).toList();
        return new PageResponse<>(list, pageNumber, customerPage.getTotalPages(), customerPage.getTotalElements(), customerPage.isLast());
    }

    @Autowired
    public CustomerResponse getCustomer(String email) {
        Customer customer = customerRepository.getCustomerByEmail(email).orElseThrow(() -> new ResourceNotFoundException(CUSTOMER_NOT_FOUND));
        return customerMapper.mapToCustomerResponse(customer);
    }

    @Override
    public CustomerResponse updateCustomer(Customer customer, Long id) throws BadRequestUserException {
        validateInput(customer);
        Customer customerToUpdate = customerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(CUSTOMER_NOT_FOUND));
        customerToUpdate.setName(customer.getName());
        customerToUpdate.setEmail(customer.getEmail());
        customerToUpdate.setPhone(customer.getPhone());
        var save = customerRepository.save(customerToUpdate);
        return customerMapper.mapToCustomerResponse(save);
    }
}
