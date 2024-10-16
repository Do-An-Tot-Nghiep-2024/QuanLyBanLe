package com.bac.se.backend.services.impl;

import com.bac.se.backend.enums.EmployeeStatus;
import com.bac.se.backend.enums.Role;
import com.bac.se.backend.exceptions.AlreadyExistsException;
import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.mapper.EmployeeMapper;
import com.bac.se.backend.models.Account;
import com.bac.se.backend.models.Employee;
import com.bac.se.backend.payload.request.EmployeeRequest;
import com.bac.se.backend.payload.response.employee.EmployeePageResponse;
import com.bac.se.backend.payload.response.employee.EmployeeResponse;
import com.bac.se.backend.repositories.AccountRepository;
import com.bac.se.backend.repositories.EmployeeRepository;
import com.bac.se.backend.services.EmployeeService;
import com.bac.se.backend.utils.ValidateInput;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final ValidateInput validateInput;
    private final EmployeeMapper employeeMapper;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    static final String EMPLOYEE_NOT_FOUND = "Employee not found";

    @Value("${application.security.password}")
    private String defaultPassword;

    @Override
    public EmployeePageResponse getEmployees(Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Object[]> employeePage = employeeRepository.getEmployees(pageable);
        List<Object[]> employeeList = employeePage.getContent();
        List<EmployeeResponse> employeeResponseList = employeeList.stream()
                .map(employeeMapper::mapObjectToEmployeeResponse)
                .toList();
        return new EmployeePageResponse(employeeResponseList, pageNumber,
                employeePage.getTotalPages(), employeePage.getTotalElements(), employeePage.isLast());
    }


    @Override
    public EmployeeResponse getEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(EMPLOYEE_NOT_FOUND));
        return employeeMapper.mapToEmployeeResponse(employee);
    }

    @Override
    public EmployeeResponse createEmployee(EmployeeRequest employeeRequest) throws BadRequestUserException {
        extracted(employeeRequest);
        if (employeeRepository.existsByEmail(employeeRequest.email())) {
            throw new AlreadyExistsException("Email already in use");
        }
        if (employeeRepository.existsByPhone(employeeRequest.phone())) {
            throw new AlreadyExistsException("Phone already in use");
        }
        Employee employee = employeeMapper.mapToEmployeeRequest(employeeRequest);

        Employee save = employeeRepository.save(employee);
        Account account = Account.builder()
                .username(employeeRequest.email())
                .password(passwordEncoder.encode(defaultPassword))
                .role(Role.EMPLOYEE)
                .build();
        accountRepository.save(account);
        return employeeMapper.mapToEmployeeResponse(save);
    }

    public void deleteEmployee(Long id) {
        Employee employeeNotFound = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(EMPLOYEE_NOT_FOUND));
        employeeNotFound.setStatus(EmployeeStatus.ABSENT);
        employeeRepository.save(employeeNotFound);
    }


    @Override
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest employeeRequest) throws BadRequestUserException {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(EMPLOYEE_NOT_FOUND));
        extracted(employeeRequest);
        if (!employee.getEmail().equals(employeeRequest.email())
                && employeeRepository.existsByEmail(employeeRequest.email())) {
            throw new AlreadyExistsException("Email already in use");
        }
        if (!employee.getPhone().equals(employeeRequest.phone())
                && employeeRepository.existsByPhone(employeeRequest.phone())) {
            throw new AlreadyExistsException("Phone already in use");
        }
        employee.setName(employeeRequest.name());
        employee.setPhone(employeeRequest.phone());
        employee.setEmail(employeeRequest.email());
        employee.setDob(employeeRequest.dob());
        Employee save = employeeRepository.save(employee);
        return employeeMapper.mapToEmployeeResponse(save);
    }

    @Override
    public List<EmployeeResponse> exportEmployees() {
        return employeeRepository.findAll().stream()
                .map(employeeMapper::mapToEmployeeResponse)
                .toList();
    }

    @Override
    public String importEmployees(List<EmployeeRequest> employeeRequestList) {
        int count = employeeRequestList.size();
        for (int i = 0; i < count; i++) {
           try{
               createEmployee(employeeRequestList.get(i));
           }catch (BadRequestUserException | AlreadyExistsException e) {
               --count;
               return "Import fail tại dòng " + (i + 1) + ": " + e.getMessage();
           }
        }
        return count + " employees imported";
    }

    private void extracted(EmployeeRequest employeeRequest) throws BadRequestUserException {
        log.info("employeeRequest is {}", employeeRequest);
        String name = employeeRequest.name();
        String phone = employeeRequest.phone();
        String email = employeeRequest.email();
        Date dob = employeeRequest.dob();
        if (name.isEmpty() || phone.isEmpty() || email.isEmpty() || dob == null) {
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
