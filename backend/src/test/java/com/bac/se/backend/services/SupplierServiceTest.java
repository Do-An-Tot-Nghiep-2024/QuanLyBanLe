package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.AlreadyExistsException;
import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.mapper.SupplierMapper;
import com.bac.se.backend.models.Supplier;
import com.bac.se.backend.payload.request.SupplierRequest;
import com.bac.se.backend.payload.response.SupplierResponse;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.repositories.SupplierRepository;
import com.bac.se.backend.services.impl.SupplierServiceImpl;
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

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SupplierServiceTest {

    @Mock
    private SupplierRepository supplierRepository;
    @InjectMocks
    private SupplierServiceImpl supplierService;
    @Mock
    private ValidateInput validateInput;
    @Mock
    private SupplierMapper supplierMapper;

    SupplierRequest supplierRequest;
    Supplier supplier;
    Long supplierId = 1L;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        supplierRequest = new SupplierRequest("John Doe", "0123456789", "john@gmail.com", "123 Main Street");
        supplier = Supplier.builder()
                .id(supplierId)
                .name("John Doe")
                .phone("0123456789")
                .email("john@gmail.com")
                .address("123 Main Street")
                .isActive(true)
                .build();
    }

    @Test
    void getSuppliersSuccess() {
        // Arrange
        int pageNumber = 0;
        int pageSize = 2;
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        List<Object[]> supplierList = List.of(new Object[]{}, new Object[]{});
        Page<Object[]> supplierPage = new PageImpl<>(supplierList, pageable, supplierList.size());
        when(supplierRepository.getSuppliers(pageable)).thenReturn(supplierPage);
        when(supplierMapper.mapObjectToSupplierResponse(any(Object[].class))).thenReturn(mock(SupplierResponse.class));
        // Act
        PageResponse<SupplierResponse> result = supplierService.getSuppliers(pageNumber, pageSize);
        // Assert
        assertEquals(2, result.getTotalElements());
        assertEquals(0, result.getPageNumber());

    }

    @Test
    void getSupplierSuccess() {
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        var response = supplierService.getSupplier(supplierId);
        assertNotNull(response);
        assertEquals(supplier.getId(), response.id());
        assertEquals(supplier.getName(), response.name());
        assertEquals(supplier.getPhone(), response.phone());
        assertEquals(supplier.getEmail(), response.email());
        assertEquals(supplier.getAddress(), response.address());
    }

    @Test
    void getSupplierFail() {
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.empty());
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> supplierService.getSupplier(supplierId)
        );
        assertEquals("Không tìm thấy nhà cung cấp", exception.getMessage());
        verify(supplierRepository).findById(supplierId);
    }

    @Test
    void createSupplierInputInvalid() {
        SupplierRequest supplierRequest = new SupplierRequest("", "", "", "");
        // Act & Assert
        BadRequestUserException exception = assertThrows(BadRequestUserException.class,
                () -> supplierService.createSupplier(supplierRequest));

        assertEquals("Vui lòng nhập đầy đủ thông tin", exception.getMessage());
        verify(supplierRepository, never()).save(any(Supplier.class));
    }

    @Test
    void createSupplierInvalidEmail() {
        SupplierRequest supplierRequest = new SupplierRequest("New Supplier", "invalidemail@example.com", "1234567890", "New Address");
        // Act & Assert
        BadRequestUserException exception = assertThrows(BadRequestUserException.class,
                () -> supplierService.createSupplier(supplierRequest));
        assertEquals("Email không hợp lệ", exception.getMessage());
        verify(supplierRepository, never()).save(any(Supplier.class));
    }
    @Test
    void createSupplierInvalidPhone() {
        SupplierRequest supplierRequest = new SupplierRequest("New Supplier", "newemail@example.com", "invalidphone", "New Address");
        when(validateInput.isValidEmail(supplierRequest.email())).thenReturn(true);
        // Act & Assert
        BadRequestUserException exception = assertThrows(BadRequestUserException.class,
                () -> supplierService.createSupplier(supplierRequest));
        assertEquals("Phone không hợp lệ", exception.getMessage());
        verify(supplierRepository, never()).save(any(Supplier.class));
    }

    @Test
    void createSupplierExistEmail() {
        SupplierRequest supplierRequest = new SupplierRequest("New Supplier", "existingemail@example.com", "1234567890", "New Address");
        when(validateInput.isValidEmail(supplierRequest.email())).thenReturn(true);
        when(validateInput.isValidPhoneNumber(supplierRequest.phone())).thenReturn(true);
        when(supplierRepository.existsByPhone(supplierRequest.phone())).thenReturn(false);
        when(supplierRepository.existsByEmail(supplierRequest.email())).thenReturn(true);
        // Act & Assert
        AlreadyExistsException exception = assertThrows(AlreadyExistsException.class,
                () -> supplierService.createSupplier(supplierRequest));
        assertEquals("Email đã được sử dụng", exception.getMessage());
        verify(supplierRepository, never()).save(any(Supplier.class));
    }

    @Test
    void createSupplierExistPhone() {
        SupplierRequest supplierRequest = new SupplierRequest("New Supplier", "existingemail@example.com", "1234567890", "New Address");
        when(validateInput.isValidEmail(supplierRequest.email())).thenReturn(true);
        when(validateInput.isValidPhoneNumber(supplierRequest.phone())).thenReturn(true);
        when(supplierRepository.existsByPhone(supplierRequest.phone())).thenReturn(true);
        // Act & Assert
        AlreadyExistsException exception = assertThrows(AlreadyExistsException.class,
                () -> supplierService.createSupplier(supplierRequest));
        assertEquals("Số điện thoại đã được sử dụng", exception.getMessage());
        verify(supplierRepository, never()).save(any(Supplier.class));
    }

    @Test
    void createSupplierSuccess() throws BadRequestUserException {
        SupplierRequest supplierRequest = new SupplierRequest("New Supplier", "newemail@example.com", "1234567890", "New Address");
        when(validateInput.isValidEmail(supplierRequest.email())).thenReturn(true);
        when(validateInput.isValidPhoneNumber(supplierRequest.phone())).thenReturn(true);
        when(supplierRepository.existsByEmail(supplierRequest.email())).thenReturn(false);
        when(supplierRepository.existsByPhone(supplierRequest.phone())).thenReturn(false);
        when(supplierRepository.save(any(Supplier.class))).thenReturn(supplier);
        // Act
        SupplierResponse response = supplierService.createSupplier(supplierRequest);
        // Assert
        assertNotNull(response);
        assertEquals(supplier.getName(), response.name());
        assertEquals(supplier.getEmail(), response.email());
        assertEquals(supplier.getPhone(), response.phone());
        assertEquals(supplier.getAddress(), response.address());

        verify(supplierRepository, times(1)).existsByEmail(supplierRequest.email());
        verify(supplierRepository, times(1)).existsByPhone(supplierRequest.phone());
        verify(supplierRepository, times(1)).save(any(Supplier.class));
    }

    @Test
    void deleteSupplierSuccess() {
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        when(supplierRepository.save(supplier)).thenReturn(supplier);
        supplierService.deleteSupplier(supplierId);
        assertFalse(supplier.isActive());
        verify(supplierRepository, times(1)).findById(supplierId);
        verify(supplierRepository, times(1)).save(supplier);
    }

    @Test
    void deleteSupplierFail() {
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.empty());
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> supplierService.deleteSupplier(supplierId)
        );
        assertEquals("Không tìm thấy nhà cung cấp", exception.getMessage());
        verify(supplierRepository).findById(supplierId);
    }

    @Test
    void updateSupplierSuccess() throws BadRequestUserException {
        // Arrange
        Long supplierId = 1L;
        SupplierRequest supplierRequest = new SupplierRequest("New Supplier", "1234567890", "newemail@example.com", "New Address");
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        when(validateInput.isValidEmail(supplierRequest.email())).thenReturn(true);
        when(validateInput.isValidPhoneNumber(supplierRequest.phone())).thenReturn(true);
        when(supplierRepository.existsByEmail(supplierRequest.email())).thenReturn(false);
        when(supplierRepository.existsByPhone(supplierRequest.phone())).thenReturn(false);
        when(supplierRepository.save(any(Supplier.class))).thenReturn(supplier);
        // Act
        SupplierResponse response = supplierService.updateSupplier(supplierRequest, supplierId);
        // Assert
        assertNotNull(response);
        assertEquals(supplierId, response.id());
        assertEquals("New Supplier", response.name());
        assertEquals("newemail@example.com", response.email());
        assertEquals("1234567890", response.phone());
        assertEquals("New Address", response.address());
        verify(supplierRepository, times(1)).findById(supplierId);
        verify(supplierRepository, times(1)).save(any(Supplier.class));
    }

    @Test
    void updateSupplierNotFound() {
        Long supplierId = 1L;
        SupplierRequest supplierRequest = new SupplierRequest("New Supplier", "newemail@example.com", "1234567890", "New Address");
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.empty());
        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> supplierService.updateSupplier(supplierRequest, supplierId));
        assertEquals("Không tìm thấy nhà cung cấp", exception.getMessage());
        verify(supplierRepository, times(1)).findById(supplierId);
        verify(supplierRepository, never()).save(any(Supplier.class));
    }

    @Test
    void updateSupplierInvalidInput() {
        Long supplierId = 1L;
        SupplierRequest supplierRequest = new SupplierRequest("", "", "", "");
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        // Act & Assert
        BadRequestUserException exception = assertThrows(BadRequestUserException.class,
                () -> supplierService.updateSupplier(supplierRequest, supplierId));

        assertEquals("Vui lòng nhập đầy đủ thông tin", exception.getMessage());
        verify(supplierRepository, times(1)).findById(anyLong());
        verify(supplierRepository, never()).save(any(Supplier.class));
    }

    @Test
    void updateSupplierInvalidEmail() {
        Long supplierId = 1L;
        SupplierRequest supplierRequest = new SupplierRequest("John Doe", "0123456789", "john@gmail.com", "123 Main Street");
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        when(validateInput.isValidEmail(supplierRequest.email())).thenReturn(false);
        // Act & Assert
        BadRequestUserException exception = assertThrows(BadRequestUserException.class,
                () -> supplierService.updateSupplier(supplierRequest, supplierId));

        assertEquals("Email không hợp lệ", exception.getMessage());
        verify(supplierRepository, times(1)).findById(anyLong());
    }

    @Test
    void updateSupplierInvalidPhone() {
        Long supplierId = 1L;
        SupplierRequest supplierRequest = new SupplierRequest("New Supplier", "newemail@example.com", "invalidphone", "New Address");
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        when(validateInput.isValidEmail(supplierRequest.email())).thenReturn(true);
        when(validateInput.isValidPhoneNumber(supplierRequest.phone())).thenReturn(false);

        // Act & Assert
        BadRequestUserException exception = assertThrows(BadRequestUserException.class,
                () -> supplierService.updateSupplier(supplierRequest, supplierId));

        assertEquals("Phone không hợp lệ", exception.getMessage());
        verify(supplierRepository, times(1)).findById(supplierId);
        verify(supplierRepository, never()).save(any(Supplier.class));
    }

    @Test
    void updateSupplierExistEmail() {
        SupplierRequest supplierRequest = new SupplierRequest("New Supplier", "existingemail@example.com", "1234567890", "New Address");
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        when(validateInput.isValidEmail(supplierRequest.email())).thenReturn(true);
        when(validateInput.isValidPhoneNumber(supplierRequest.phone())).thenReturn(true);
        when(supplierRepository.existsByEmail(supplierRequest.email())).thenReturn(true);
        // Act & Assert
        AlreadyExistsException exception = assertThrows(AlreadyExistsException.class,
                () -> supplierService.updateSupplier(supplierRequest, supplierId));

        assertEquals("Email đã được sử dụng", exception.getMessage());
        verify(supplierRepository, times(1)).findById(supplierId);
        verify(supplierRepository, never()).save(any(Supplier.class));
    }

    @Test
    void updateSupplierExistPhone() {
        SupplierRequest request = new SupplierRequest("New Supplier", "newemail@example.com", "existingphone", "New Address");

        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        when(validateInput.isValidEmail(request.email())).thenReturn(true);
        when(validateInput.isValidPhoneNumber(request.phone())).thenReturn(true);
        when(supplierRepository.existsByPhone(request.phone())).thenReturn(true);
        // Act & Assert
        AlreadyExistsException exception = assertThrows(AlreadyExistsException.class,
                () -> supplierService.updateSupplier(request, supplierId));
        assertEquals("Số điện thoại đã được sử dụng", exception.getMessage());
        assertNotEquals(supplier.getPhone(), request.phone());
        verify(supplierRepository, times(1)).findById(supplierId);
        verify(supplierRepository, never()).save(any(Supplier.class));
    }



}