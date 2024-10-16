package com.bac.se.backend.repositories;

import com.bac.se.backend.models.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer,Long> {
    @Query("select c.id,c.name, c.email, c.phone from Customer c order by c.name asc")
    Page<Object[]> getCustomers(Pageable pageable);

    Optional<Customer> getCustomerByEmail(String email);

    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);

    Optional<Customer> findByPhone(String phone);
}
