package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.payload.request.EmployeeRequest;
import com.bac.se.backend.payload.response.employee.EmployeePageResponse;
import com.bac.se.backend.payload.response.employee.EmployeeResponse;

import java.util.List;

public interface EmployeeService {

    EmployeePageResponse getEmployees(Integer pageNumber, Integer pageSize);

    EmployeeResponse getEmployee(Long id);

    EmployeeResponse createEmployee(EmployeeRequest employeeRequest) throws BadRequestUserException;

    void deleteEmployee(Long id);

    EmployeeResponse updateEmployee(Long id, EmployeeRequest employeeRequest) throws BadRequestUserException;

    List<EmployeeResponse> exportEmployees();

    String importEmployees(List<EmployeeRequest> employeeRequestList) throws BadRequestUserException;

}
