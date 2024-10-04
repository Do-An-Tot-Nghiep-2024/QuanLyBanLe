package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.models.Customer;
import com.bac.se.backend.payload.response.CustomerResponse;
import com.bac.se.backend.repositories.CustomerRepository;
import com.bac.se.backend.utils.ValidateInput;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;
    private final ValidateInput validateInput;
    static final String CUSTOMER_NOT_FOUND = "Không tìm thấy khách hàng";


     void validateInput(Customer customer) throws BadRequestUserException {
        if(customer.getName().isEmpty() || customer.getEmail().isEmpty() || customer.getPhone().isEmpty()) {
            throw new BadRequestUserException("Vui lòng nhập đầy đủ thông tin");
        }
        if(!validateInput.isValidEmail(customer.getEmail())) {
            throw new BadRequestUserException("Email không hợp lệ");
        }
        if(!validateInput.isValidPhoneNumber(customer.getPhone())) {
            throw new BadRequestUserException("Số điện thoại không hợp lệ");
        }
    }

    public CustomerResponse mapToCustomerResponse(Customer customer) {
        return new CustomerResponse(
                customer.getId(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhone()
        );
    }

    public List<CustomerResponse> getCustomers() {
        return customerRepository.getCustomers()
                .stream()
                .map(objects -> new CustomerResponse(
                        Long.valueOf(objects[0].toString()),// customer_id
                        (String) objects[1],                   // name
                        (String) objects[2],                   // email
                        (String) objects[3]                    // phone
                ))
                .toList();
    }

    public CustomerResponse getCustomer(String email) {
        Customer customer = customerRepository.getCustomerByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(CUSTOMER_NOT_FOUND));
        return mapToCustomerResponse(customer);
    }

    public void deleteCustomer(Long id) {
        var customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(CUSTOMER_NOT_FOUND));
        customer.setActive(false);
        customerRepository.save(customer);

    }

    public CustomerResponse updateCustomer(Customer customer, Long id) throws BadRequestUserException {
        validateInput(customer);
        Customer customerToUpdate = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(CUSTOMER_NOT_FOUND));
        customerToUpdate.setName(customer.getName());
        customerToUpdate.setEmail(customer.getEmail());
        customerToUpdate.setPhone(customer.getPhone());
        customerToUpdate.setActive(customer.isActive());
        var save = customerRepository.save(customerToUpdate);
        return mapToCustomerResponse(save);
    }

}
