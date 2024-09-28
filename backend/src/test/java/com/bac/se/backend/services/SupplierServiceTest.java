package com.bac.se.backend.services;

import com.bac.se.backend.mapper.SupplierMapper;
import com.bac.se.backend.payload.request.SupplierRequest;
import com.bac.se.backend.payload.response.EmployeePageResponse;
import com.bac.se.backend.payload.response.EmployeeResponse;
import com.bac.se.backend.payload.response.PageResponse;
import com.bac.se.backend.payload.response.SupplierResponse;
import com.bac.se.backend.repositories.SupplierRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class SupplierServiceTest {

    @Mock
    private SupplierRepository supplierRepository;
    @InjectMocks
    private SupplierService supplierService;
    @Mock
    private SupplierMapper supplierMapper;

    private SupplierRequest supplierRequest;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        supplierRequest = new SupplierRequest("John Doe", "0123456789", "john@gmail.com", "123 Main Street");
    }

    @Test
    void getSuppliersSuccess() {
        int pageNumber = 0;
        int pageSize = 10;
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        // Mocking a sample Employee data
        Object[] supplierData1 = {"1","John Doe", "john@example.com", "1234567890"};
        Object[] supplierData2 = {"2","Jane Smith", "jane@example.com", "9876543210"};
        List<Object[]> supplierList = List.of(supplierData1, supplierData2);

        // Mocking the EmployeeResponse objects
        SupplierResponse supplierResponse1 = su
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
    void getSupplierSuccess() {
    }

    @Test
    void createSupplierSuccess() {
    }

    @Test
    void deleteSupplierSuccess() {
    }

    @Test
    void updateSupplierSuccess() {
    }
}