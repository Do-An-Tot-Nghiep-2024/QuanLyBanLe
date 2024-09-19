package com.bac.se.backend.repositories;

import com.bac.se.backend.models.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee,Long> {

    boolean existsByPhone(String phone);
    boolean existsByEmail(String email);
}
