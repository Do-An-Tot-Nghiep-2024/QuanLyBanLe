package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.models.Customer;
import com.bac.se.backend.payload.response.CustomerResponse;
import com.bac.se.backend.repositories.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;

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
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        return mapToCustomerResponse(customer);
    }

    public void deleteCustomer(Long id) {
        customerRepository.findById(id)
                .ifPresentOrElse(
                        customerRepository::delete,
                        () -> {
                            throw new ResourceNotFoundException("Customer not found");
                        }
                );
    }

    public CustomerResponse updateCustomer(Customer customer, Long id) {
        customer.setId(id);
        Customer save = customerRepository.save(customer);
        return mapToCustomerResponse(save);
    }

}
