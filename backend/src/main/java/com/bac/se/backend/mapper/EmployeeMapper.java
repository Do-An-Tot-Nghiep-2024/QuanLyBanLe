package com.bac.se.backend.mapper;

import com.bac.se.backend.enums.EmployeeStatus;
import com.bac.se.backend.models.Employee;
import com.bac.se.backend.payload.request.EmployeeRequest;
import com.bac.se.backend.payload.response.employee.EmployeeResponse;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class EmployeeMapper {
    public Employee mapToEmployeeRequest(EmployeeRequest employeeRequest) {
        return Employee.builder()
                .name(employeeRequest.name())
                .phone(employeeRequest.phone())
                .email(employeeRequest.email())
                .dob(employeeRequest.dob())
                .status(EmployeeStatus.ACTIVE)
                .build();
    }

    public EmployeeResponse mapToEmployeeResponse(Employee employee) {
        return new EmployeeResponse(
                employee.getId(),
                employee.getName(),
                employee.getPhone(),
                employee.getEmail(),
                employee.getDob());
    }

    public EmployeeResponse mapObjectToEmployeeResponse(Object[] objects) {
        return new EmployeeResponse(
                Long.valueOf(objects[0].toString()), // id
                (String) objects[1],                   // name
                (String) objects[2],                   // phone
                (String) objects[3],                   // email
                (Date) objects[4]               // dob
        );
    }

}
