package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.payload.request.EmployeeRequest;
import com.bac.se.backend.payload.response.employee.EmployeePageResponse;
import com.bac.se.backend.payload.response.employee.EmployeeResponse;

public interface EmployeeService {

    EmployeePageResponse getEmployees(Integer pageNumber, Integer pageSize);

    EmployeeResponse getEmployee(Long id);

    EmployeeResponse createEmployee(EmployeeRequest employeeRequest) throws BadRequestUserException;

    void deleteEmployee(Long id);

    EmployeeResponse updateEmployee(Long id, EmployeeRequest employeeRequest) throws BadRequestUserException;

}
