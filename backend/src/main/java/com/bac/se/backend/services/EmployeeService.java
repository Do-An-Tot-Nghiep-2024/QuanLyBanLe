package com.bac.se.backend.services;

import com.bac.se.backend.enums.EmployeeStatus;
import com.bac.se.backend.exceptions.AlreadyExistsException;
import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.mapper.EmployeeMapper;
import com.bac.se.backend.models.Employee;
import com.bac.se.backend.payload.request.EmployeeRequest;
import com.bac.se.backend.payload.response.EmployeePageResponse;
import com.bac.se.backend.payload.response.EmployeeResponse;
import com.bac.se.backend.repositories.EmployeeRepository;
import com.bac.se.backend.utils.ValidateInput;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final ValidateInput validateInput;
    private final EmployeeMapper employeeMapper;

    private final String EMPLOYEE_NOT_FOUND = "Employee not found";
    
    public EmployeePageResponse getEmployees(Integer pageNumber,Integer pageSize){
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Object[]> employeePage = employeeRepository.getEmployees(pageable);
        List<Object[]> employeeList = employeePage.getContent();
        List<EmployeeResponse> employeeResponseList = employeeList.stream()
                .map(employeeMapper::mapObjectToEmployeeResponse)
                .toList();
        return new EmployeePageResponse(employeeResponseList, pageNumber,
                employeePage.getTotalPages(), employeePage.getTotalElements(), employeePage.isLast());
    }
    
    
    public EmployeeResponse getEmployee(Long id){
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException(EMPLOYEE_NOT_FOUND));
        return employeeMapper.mapToEmployeeResponse(employee);
    }

    public EmployeeResponse createEmployee(EmployeeRequest employeeRequest) throws BadRequestUserException {
        extracted(employeeRequest);
        if(employeeRepository.existsByEmail(employeeRequest.email())){
            throw new AlreadyExistsException("Email already in use");
        }
        if(employeeRepository.existsByPhone(employeeRequest.phone())){
            throw new AlreadyExistsException("Phone already in use");
        }
        Employee employee = employeeMapper.mapToEmployeeRequest(employeeRequest);
        Employee save = employeeRepository.save(employee);
        return employeeMapper.mapToEmployeeResponse(save);
    }

    public void deleteEmployee(Long id){
        Employee employeeNotFound = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(EMPLOYEE_NOT_FOUND));
        employeeNotFound.setEmployeeStatus(EmployeeStatus.ABSENT);
        employeeRepository.save(employeeNotFound);
    }

    public EmployeeResponse updateEmployee(Long id, EmployeeRequest employeeRequest) throws BadRequestUserException {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException(EMPLOYEE_NOT_FOUND));
        extracted(employeeRequest);
        if(!employee.getEmail().equals(employeeRequest.email())
                && employeeRepository.existsByEmail(employeeRequest.email())){
            throw new AlreadyExistsException("Email already in use");
        }
        if(!employee.getPhone().equals(employeeRequest.phone())
                && employeeRepository.existsByPhone(employeeRequest.phone())){
            throw new AlreadyExistsException("Phone already in use");
        }
        employee.setName(employeeRequest.name());
        employee.setPhone(employeeRequest.phone());
        employee.setEmail(employeeRequest.email());
        employee.setDob(employeeRequest.dob());
        Employee save = employeeRepository.save(employee);
        return employeeMapper.mapToEmployeeResponse(save);
    }

    private void extracted(EmployeeRequest employeeRequest) throws BadRequestUserException {
        log.info("employeeRequest is {}", employeeRequest);
        String name = employeeRequest.name();
        String phone = employeeRequest.phone();
        String email = employeeRequest.email();
        Date dob = employeeRequest.dob();
        if(name.isEmpty() || phone.isEmpty() || email.isEmpty() || dob == null){
            throw new BadRequestUserException("Input is required");
        }
        if (!validateInput.isValidEmail(email)) {
            throw new BadRequestUserException("Email is not valid");
        }
        if (!validateInput.isValidPhoneNumber(phone)) {
            throw new BadRequestUserException("Phone is not valid");
        }
    }

}