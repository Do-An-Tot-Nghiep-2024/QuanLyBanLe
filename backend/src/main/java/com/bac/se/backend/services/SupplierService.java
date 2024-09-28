package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.AlreadyExistsException;
import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.mapper.SupplierMapper;
import com.bac.se.backend.models.Supplier;
import com.bac.se.backend.payload.request.SupplierRequest;
import com.bac.se.backend.payload.response.PageResponse;
import com.bac.se.backend.payload.response.SupplierResponse;
import com.bac.se.backend.repositories.SupplierRepository;
import com.bac.se.backend.utils.ValidateInput;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final SupplierMapper supplierMapper;
    private final ValidateInput validateInput;

    public PageResponse<SupplierResponse> getSuppliers(Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Object[]> supplierPage = supplierRepository.getSuppliers(pageable);
        List<Object[]> supplierList = supplierPage.getContent();
        List<SupplierResponse> employeeResponseList = supplierList.stream()
                .map(supplierMapper::mapObjectToSupplierResponse)
                .toList();
        return new PageResponse<>(employeeResponseList, pageNumber,
                supplierPage.getTotalPages(), supplierPage.getTotalElements(), supplierPage.isLast());
    }

    public SupplierResponse getSupplier(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà cung cấp nào"));
        return new SupplierResponse(
                supplier.getId(),supplier.getName(),
                supplier.getPhone(), supplier.getEmail(), supplier.getAddress());
    }

    public SupplierResponse createSupplier(SupplierRequest supplierRequest) throws BadRequestUserException {
        validateRequest(supplierRequest);
        if (supplierRepository.existsByEmail(supplierRequest.email())) {
            throw new AlreadyExistsException("Email đã được sử dụng");
        }
        if (supplierRepository.existsByPhone(supplierRequest.phone())) {
            throw new AlreadyExistsException("Số điện thoại đã được sử dụng");
        }
        Supplier supplier = Supplier.builder()
                .name(supplierRequest.name())
                .phone(supplierRequest.phone())
                .email(supplierRequest.email())
                .address(supplierRequest.address())
                .isActive(true)
                .build();
        Supplier save = supplierRepository.save(supplier);
        return new SupplierResponse(
                save.getId(), save.getName(),
                save.getPhone(), save.getEmail(), save.getAddress());
    }

    public void deleteSupplier(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà cung cấp nào"));
        supplier.setActive(false);
        supplierRepository.save(supplier);
    }

    public SupplierResponse updateSupplier(SupplierRequest supplierRequest, Long id) throws BadRequestUserException {
        Supplier supplierNotFound = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà cung cấp nào"));
        validateRequest(supplierRequest);
        if (!supplierNotFound.getEmail().equals(supplierRequest.email())
                && supplierRepository.existsByEmail(supplierRequest.email())) {
            throw new AlreadyExistsException("Email đã được sử dụng");
        }
        if (!supplierNotFound.getPhone().equals(supplierRequest.phone())
                && supplierRepository.existsByPhone(supplierRequest.phone())) {
            throw new AlreadyExistsException("Số điện thoại đã được sử dụng");
        }
        supplierNotFound.setName(supplierRequest.name());
        supplierNotFound.setPhone(supplierRequest.phone());
        supplierNotFound.setEmail(supplierRequest.email());
        supplierNotFound.setAddress(supplierRequest.address());
        Supplier save = supplierRepository.save(supplierNotFound);
        return new SupplierResponse(
                save.getId(), save.getName(),
                save.getPhone(), save.getEmail(), save.getAddress());
    }

    private void validateRequest(SupplierRequest supplierRequest) throws BadRequestUserException {
        String name = supplierRequest.name();
        String phone = supplierRequest.phone();
        String email = supplierRequest.email();
        String address = supplierRequest.address();
        if(name.isEmpty() || phone.isEmpty() || email.isEmpty() || address.isEmpty()){
            throw new BadRequestUserException("Vui lòng nhập đầy đủ thông tin");
        }
        if (!validateInput.isValidEmail(email)) {
            throw new BadRequestUserException("Email is not valid");
        }
        if (!validateInput.isValidPhoneNumber(phone)) {
            throw new BadRequestUserException("Phone is not valid");
        }
    }
}
