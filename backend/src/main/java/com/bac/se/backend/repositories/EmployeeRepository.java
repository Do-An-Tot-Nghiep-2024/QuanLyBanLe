package com.bac.se.backend.repositories;

import com.bac.se.backend.models.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee,Long> {

    @Query("select e.id, e.name, e.phone, e.email, e.dob, e.status from Employee e where e.status = 'ACTIVE'")
    Page<Object[]> getEmployees(Pageable pageable);

    boolean existsByPhone(String phone);
    boolean existsByEmail(String email);
}
