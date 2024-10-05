package com.bac.se.backend.mapper;

import com.bac.se.backend.models.Employee;
import com.bac.se.backend.payload.request.EmployeeRequest;
import com.bac.se.backend.payload.response.employee.EmployeeResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;

class EmployeeMapperTest {


    private EmployeeMapper employeeMapper;

    @BeforeEach
    void setUp() {
        employeeMapper = new EmployeeMapper();
    }

    @Test
    void mapToEmployeeRequest() {
        EmployeeRequest employeeRequest = new EmployeeRequest("name", "phone", "email", new Date());
        Employee employee = employeeMapper.mapToEmployeeRequest(employeeRequest);
        assertEquals(employee.getName(), employeeRequest.name());
        assertEquals(employee.getPhone(), employeeRequest.phone());
        assertEquals(employee.getEmail(), employeeRequest.email());
        assertEquals(employee.getDob(), employeeRequest.dob());
    }

    @Test
    void mapToEmployeeResponse() {
        Employee employee = Employee.builder().name("name").phone("phone").email("email").dob(new Date()).build();
        EmployeeResponse employeeResponse = employeeMapper.mapToEmployeeResponse(employee);
        assertEquals(employeeResponse.name(), employee.getName());
        assertEquals(employeeResponse.phone(), employee.getPhone());
        assertEquals(employeeResponse.email(), employee.getEmail());
        assertEquals(employeeResponse.dob(), employee.getDob());
    }

    @Test
    void mapObjectToEmployeeResponse() {
        Object[] objects = new Object[]{"1", "name", "phone", "email", new Date()};
        EmployeeResponse employeeResponse = employeeMapper.mapObjectToEmployeeResponse(objects);
        assertEquals(employeeResponse.name(), objects[1]);
        assertEquals(employeeResponse.phone(), objects[2]);
        assertEquals(employeeResponse.email(), objects[3]);
        assertEquals(employeeResponse.dob(), objects[4]);
    }
}