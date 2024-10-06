package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.payload.request.SupplierRequest;
import com.bac.se.backend.payload.response.SupplierResponse;
import com.bac.se.backend.payload.response.common.PageResponse;

public interface SupplierService {

    PageResponse<SupplierResponse> getSuppliers(Integer pageNumber, Integer pageSize);

    SupplierResponse getSupplier(Long id);

    SupplierResponse createSupplier(SupplierRequest supplierRequest) throws BadRequestUserException;

    void deleteSupplier(Long id);

    SupplierResponse updateSupplier(SupplierRequest supplierRequest, Long id) throws BadRequestUserException;


}
