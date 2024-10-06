package com.bac.se.backend.services;

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
import com.bac.se.backend.services.impl.EmployeeServiceImpl;
import com.bac.se.backend.utils.ValidateInput;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EmployeeServiceTest {
    @Mock
    private EmployeeRepository employeeRepository;
    @InjectMocks
    private EmployeeServiceImpl employeeService;
    @Mock
    private EmployeeMapper employeeMapper;

    @Mock
    private ValidateInput validateInput;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private final String EMPLOYEE_NOT_FOUND = "Employee not found";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getEmployees() {
         // Arrange
    int pageNumber = 0;
        int pageSize = 10;
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        // Mocking a sample Employee data
        Object[] employeeData1 = {"John Doe", "john@example.com", "1234567890"};
        Object[] employeeData2 = {"Jane Smith", "jane@example.com", "9876543210"};
        List<Object[]> employeeList = List.of(employeeData1, employeeData2);

        // Mocking the EmployeeResponse objects
        EmployeeResponse employeeResponse1 = new EmployeeResponse(1L,"John Doe", "john@example.com", "1234567890", new Date());
        EmployeeResponse employeeResponse2 = new EmployeeResponse(2L,"Jane Smith", "jane@example.com", "9876543210", new Date());
        List<EmployeeResponse> employeeResponseList = List.of(employeeResponse1, employeeResponse2);

        // Creating a Page<Object[]> for mocking the repository call
        Page<Object[]> employeePage = new PageImpl<>(employeeList, pageable, employeeList.size());

        when(employeeRepository.getEmployees(pageable)).thenReturn(employeePage);
        when(employeeMapper.mapObjectToEmployeeResponse(employeeData1)).thenReturn(employeeResponse1);
        when(employeeMapper.mapObjectToEmployeeResponse(employeeData2)).thenReturn(employeeResponse2);

        // Act
        EmployeePageResponse result = employeeService.getEmployees(pageNumber, pageSize);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.responseList().size());
        assertEquals(pageNumber, result.pageNumber());
        assertEquals(1, result.totalPages());  // Only one page since the size matches
        assertEquals(2, result.totalElements());
        assertEquals(employeeResponseList, result.responseList());
        assertEquals(employeeResponse1, result.responseList().get(0));
        assertEquals(employeeResponse2, result.responseList().get(1));
        assertTrue(result.isLastPage());  // It's the last page since all data fits in one page
        verify(employeeRepository).getEmployees(pageable);
        verify(employeeMapper).mapObjectToEmployeeResponse(employeeData1);
        verify(employeeMapper).mapObjectToEmployeeResponse(employeeData2);
    }

    @Test
    void getEmployeeSuccess() {
        Employee employee = Employee.builder()
                .id(1L)
                .name("name")
                .email("email")
                .phone("phone")
                .dob(new Date())
                .status(EmployeeStatus.ACTIVE)
                .build();
        EmployeeResponse employeeResponse = new EmployeeResponse(
                1L,
                "name",
                "email",
                "phone",
                new Date()
        );
        when(employeeRepository.findById(employee.getId())).thenReturn(Optional.of(employee));
        when(employeeMapper.mapToEmployeeResponse(employee)).thenReturn(employeeResponse);
        // Act
        EmployeeResponse result = employeeService.getEmployee(employee.getId());
        // Assert
        assertNotNull(result);
        assertEquals(employeeResponse, result);
        verify(employeeRepository, times(1)).findById(employee.getId());
        verify(employeeMapper, times(1)).mapToEmployeeResponse(employee);
    }

    @Test
    void getEmployeeNotFound() {
        Long employeeId = 1L;

        when(employeeRepository.findById(employeeId)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> employeeService.getEmployee(employeeId));

        assertEquals(EMPLOYEE_NOT_FOUND, exception.getMessage());  // Ensure the exception message is correct
        verify(employeeRepository).findById(employeeId);  // Verify if the repository's findById was called
        verify(employeeMapper, never()).mapToEmployeeResponse(any()); // Verify if the mapper's mapToEmployeeResponse was not called
    }

    @Test
    void createEmployeeSuccess() throws BadRequestUserException {
        // Arrange
        Long employeeId = 1L;
        EmployeeRequest employeeRequest = new EmployeeRequest(
                "John Doe",
                "0123456789",
                "john@gmail.com",
                new Date()
        );
        Employee employee = Employee.builder()
                .id(employeeId)
                .name("John Doe")
                .email("john@gmail.com")
                .phone("0123456789")
                .dob(new Date())
                .status(EmployeeStatus.ACTIVE)
                .build();
        Employee savedEmployee = Employee.builder()
                .id(employeeId)
                .name("John Doe")
                .email("john@gmail.com")
                .phone("0123456789")
                .dob(new Date())
                .status(EmployeeStatus.ACTIVE)
                .build();
        EmployeeResponse employeeResponse = new EmployeeResponse(
                employeeId,
                "John Doe",
                "0123456789",
                "john@gmail.com",
                new Date()
        );
        Account account = Account.builder()
                .username(employeeRequest.email())
                .password(passwordEncoder.encode("123456"))
                .role(Role.EMPLOYEE)
                .build();
        when(employeeRepository.existsByEmail(employeeRequest.email())).thenReturn(false);
        when(employeeRepository.existsByPhone(employeeRequest.phone())).thenReturn(false);
        when(validateInput.isValidEmail(employeeRequest.email())).thenReturn(true);
        when(validateInput.isValidPhoneNumber(employeeRequest.phone())).thenReturn(true);
        when(employeeMapper.mapToEmployeeRequest(employeeRequest)).thenReturn(employee);
        when(accountRepository.save(any(Account.class))).thenReturn(account);
        when(employeeRepository.save(employee)).thenReturn(savedEmployee);
        when(employeeMapper.mapToEmployeeResponse(savedEmployee)).thenReturn(employeeResponse);

        // Act
        EmployeeResponse result = employeeService.createEmployee(employeeRequest);

        // Assert
        assertNotNull(result);
        assertEquals(employeeResponse, result);
        verify(employeeRepository).existsByEmail(employeeRequest.email());
        verify(employeeRepository).existsByPhone(employeeRequest.phone());
        verify(employeeMapper).mapToEmployeeRequest(employeeRequest);
        verify(accountRepository).save(any(Account.class));
        verify(employeeRepository).save(any(Employee.class));
        verify(employeeMapper).mapToEmployeeResponse(savedEmployee);
    }


    @Test
    void createEmployeeInvalidInput(){
        // Arrange
        EmployeeRequest employeeRequest = new EmployeeRequest("", "0123456789", "showdown@gmail.com", new Date());
        when(validateInput.isValidEmail(employeeRequest.email())).thenReturn(true);
        when(validateInput.isValidPhoneNumber(employeeRequest.phone())).thenReturn(true);
        // Act & Assert
        BadRequestUserException exception = assertThrows(BadRequestUserException.class,
                () -> employeeService.createEmployee(employeeRequest));
        assertEquals("Input is required", exception.getMessage());  // Ensure correct exception message
        verify(employeeRepository, never()).existsByEmail(any());  // Ensure existsByEmail was never called
        verify(employeeRepository, never()).existsByPhone(any());
    }

    @Test
    void createEmployeeEmailAlreadyExists(){
        // Arrange
        EmployeeRequest employeeRequest = new EmployeeRequest("John Doe", "0123456789", "john@gmail.com", new Date());
        when(validateInput.isValidEmail(employeeRequest.email())).thenReturn(true);
        when(validateInput.isValidPhoneNumber(employeeRequest.phone())).thenReturn(true);
        when(employeeRepository.existsByEmail(employeeRequest.email())).thenReturn(true);
        // Act & Assert
        AlreadyExistsException exception = assertThrows(AlreadyExistsException.class,
                () -> employeeService.createEmployee(employeeRequest));
        assertEquals("Email already in use", exception.getMessage());
        verify(employeeRepository).existsByEmail(employeeRequest.email());
        verify(employeeMapper, never()).mapToEmployeeRequest(any());
        verify(employeeRepository, never()).save(any());
        verify(employeeMapper, never()).mapToEmployeeResponse(any());
    }

    @Test
    void createEmployeePhoneAlreadyExists() {
        // Arrange
        EmployeeRequest employeeRequest = new EmployeeRequest("John Doe", "0123456789", "john@gmail.com", new Date());
        when(validateInput.isValidEmail(employeeRequest.email())).thenReturn(true);
        when(validateInput.isValidPhoneNumber(employeeRequest.phone())).thenReturn(true);
        when(employeeRepository.existsByPhone(employeeRequest.phone())).thenReturn(true);
        // Act & Assert
        AlreadyExistsException exception = assertThrows(AlreadyExistsException.class,
                () -> employeeService.createEmployee(employeeRequest));
        assertEquals("Phone already in use", exception.getMessage());
        verify(employeeRepository).existsByPhone(employeeRequest.phone());
        verify(employeeMapper, never()).mapToEmployeeRequest(any());
        verify(employeeRepository, never()).save(any());
        verify(employeeMapper, never()).mapToEmployeeResponse(any());
    }

    @Test
    void deleteEmployeeSuccess() {
        Long employeeId = 1L;
        Employee employee = Employee.builder()
                .id(employeeId)
                .status(EmployeeStatus.ACTIVE)
                .build();

        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));

        // Act
        employeeService.deleteEmployee(employeeId);
        // Assert
        assertEquals(EmployeeStatus.ABSENT, employee.getStatus());
        verify(employeeRepository, times(1)).findById(employeeId);
        verify(employeeRepository, times(1)).save(employee);
    }

    @Test
    void deleteEmployeeNotFound() {
        Long employeeId = 1L;

        when(employeeRepository.findById(employeeId)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> employeeService.deleteEmployee(employeeId));

        assertEquals(EMPLOYEE_NOT_FOUND, exception.getMessage());  // Ensure the exception message is correct
        verify(employeeRepository).findById(employeeId);  // Verify that findById was called
        verify(employeeRepository, never()).save(any());  // Ensure save was never called when employee doesn't exis
    }

    @Test
    void updateEmployeeSuccess() throws BadRequestUserException {
        // Arrange
        Long employeeId = 1L;
        Employee employee = Employee.builder()
                .id(employeeId)
                .name("David")
                .email("david@gmail.com")
                .phone("07777777777")
                .dob(new Date())
                .status(EmployeeStatus.ACTIVE)
                .build();
        EmployeeRequest employeeRequest = new EmployeeRequest(
                "John Doe",
                "0123456789",
                "john@gmail.com",
                new Date()
        );
        Employee updatedEmployee = Employee.builder()
                .id(employeeId)
                .name("John Doe")
                .email("john@gmail.com")
                .phone("0123456789")
                .dob(new Date())
                .status(EmployeeStatus.ACTIVE)
                .build();
        EmployeeResponse employeeResponse = new EmployeeResponse(
                employeeId,
                "John Doe",
                "0123456789",
                "john@gmail.com",
                new Date()
        );

        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
        when(employeeRepository.existsByEmail(employeeRequest.email())).thenReturn(false);
        when(employeeRepository.existsByPhone(employeeRequest.phone())).thenReturn(false);
        when(validateInput.isValidEmail(employeeRequest.email())).thenReturn(true);
        when(validateInput.isValidPhoneNumber(employeeRequest.phone())).thenReturn(true);
        when(employeeRepository.save(any(Employee.class))).thenReturn(updatedEmployee);
        when(employeeMapper.mapToEmployeeResponse(updatedEmployee)).thenReturn(employeeResponse);

        // Act
        EmployeeResponse result = employeeService.updateEmployee(employeeId, employeeRequest);

        // Assert
        assertNotNull(result);
        assertEquals(employeeResponse, result);
        verify(employeeRepository).findById(employeeId);
        verify(employeeRepository).existsByEmail(employeeRequest.email());
        verify(employeeRepository).existsByPhone(employeeRequest.phone());
        verify(employeeRepository).save(any(Employee.class));
        verify(employeeMapper).mapToEmployeeResponse(updatedEmployee);

    }

    @Test
    void updateEmployeeNotFound() {
        // Arrange
        Long employeeId = 1L;
        EmployeeRequest employeeRequest = new EmployeeRequest(
                "John Doe",
                "0123456789",
                "john@gmail.com",
                new Date()
        );
        when(employeeRepository.findById(employeeId)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> employeeService.updateEmployee(employeeId, employeeRequest));

        assertEquals(EMPLOYEE_NOT_FOUND, exception.getMessage());  // Ensure the exception message is correct
        verify(employeeRepository).findById(employeeId);  // Verify that findById was called
        verify(employeeRepository, never()).existsByEmail(any());  // Ensure existsByEmail was never called
        verify(employeeRepository, never()).existsByPhone(any());  // Ensure existsByPhone was never called
        verify(employeeRepository, never()).save(any());  // Ensure save was never called
    }

    @Test
    void updateEmployeeEmailAlreadyExists() {
        // Arrange
        Long employeeId = 1L;
        EmployeeRequest employeeRequest = new EmployeeRequest("John Doe", "john@example.com", "1234567890", new Date());
        Employee employee =  Employee.builder()
                .id(employeeId)
                .name("David")
                .email("david@gmail.com")
                .phone("0214815126")
                .dob(new Date())
                .status(EmployeeStatus.ACTIVE)
                .build();
        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
        when(employeeRepository.existsByEmail(employeeRequest.email())).thenReturn(true);
        when(validateInput.isValidEmail(employeeRequest.email())).thenReturn(true);
        when(validateInput.isValidPhoneNumber(employeeRequest.phone())).thenReturn(true);

        // Act & Assert
        AlreadyExistsException exception = assertThrows(AlreadyExistsException.class,
                () -> employeeService.updateEmployee(employeeId, employeeRequest));

        assertEquals("Email already in use", exception.getMessage());
        verify(employeeRepository).existsByEmail(employeeRequest.email());
    }

    @Test
    void updateEmployeePhoneAlreadyExists() {
        Long employeeId = 1L;
        EmployeeRequest employeeRequest = new EmployeeRequest("John Doe", "0214815122", "john@gmail.com", new Date());
        Employee employee = Employee.builder()
                .id(employeeId)
                .name("David")
                .email("david@gmail.com")
                .phone("0214815126")
                .dob(new Date())
                .status(EmployeeStatus.ACTIVE)
                .build();

        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
        when(employeeRepository.existsByPhone(employeeRequest.phone())).thenReturn(true);
        when(validateInput.isValidEmail(employeeRequest.email())).thenReturn(true);
        when(validateInput.isValidPhoneNumber(employeeRequest.phone())).thenReturn(true);
        // Act & Assert
        AlreadyExistsException exception = assertThrows(AlreadyExistsException.class,
                () -> employeeService.updateEmployee(employeeId, employeeRequest));

        assertEquals("Phone already in use", exception.getMessage());
        verify(employeeRepository).existsByPhone(employeeRequest.phone());
    }

    @Test
    void updateEmployeeInvalidInput() {
        Long employeeId = 1L;
        EmployeeRequest employeeRequest = new EmployeeRequest("", "0123456789", "showdown@gmail.com", new Date());
        Employee employee = Employee.builder().build();

        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
        when(validateInput.isValidEmail(employeeRequest.email())).thenReturn(true);
        when(validateInput.isValidPhoneNumber(employeeRequest.phone())).thenReturn(true);
        // Act & Assert
        BadRequestUserException exception = assertThrows(BadRequestUserException.class,
                () -> employeeService.updateEmployee(employeeId, employeeRequest));

        assertEquals("Input is required", exception.getMessage());  // Ensure correct exception message
        verify(employeeRepository, never()).existsByEmail(any());  // Ensure existsByEmail was never called
        verify(employeeRepository, never()).existsByPhone(any());
    }

    @Test
    void updateEmployeeInvalidEmail() {
        Long employeeId = 1L;
        EmployeeRequest employeeRequest = new EmployeeRequest("John Doe", "0123456789", "showdown@gmail.com", new Date());
        Employee employee = Employee.builder().build();

        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
        when(validateInput.isValidEmail(employeeRequest.email())).thenReturn(false);
        when(validateInput.isValidPhoneNumber(employeeRequest.phone())).thenReturn(true);
        // Act & Assert
        BadRequestUserException exception = assertThrows(BadRequestUserException.class,
                () -> employeeService.updateEmployee(employeeId, employeeRequest));

        assertEquals("Email is not valid", exception.getMessage());  // Ensure correct exception message
        verify(employeeRepository, never()).existsByEmail(any());  // Ensure existsByEmail was never called
        verify(employeeRepository, never()).existsByPhone(any());
    }

    @Test
    void updateEmployeeInvalidPhone() {
        Long employeeId = 1L;
        EmployeeRequest employeeRequest = new EmployeeRequest("John Doe", "01234567891", "showdown@gmail.com", new Date());
        Employee employee = Employee.builder().build();

        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
        when(validateInput.isValidEmail(employeeRequest.email())).thenReturn(true);
        when(validateInput.isValidPhoneNumber(employeeRequest.phone())).thenReturn(false);
        // Act & Assert
        BadRequestUserException exception = assertThrows(BadRequestUserException.class,
                () -> employeeService.updateEmployee(employeeId, employeeRequest));

        assertEquals("Phone is not valid", exception.getMessage());  // Ensure correct exception message
        verify(employeeRepository, never()).existsByEmail(any());  // Ensure existsByEmail was never called
        verify(employeeRepository, never()).existsByPhone(any());
    }
}

