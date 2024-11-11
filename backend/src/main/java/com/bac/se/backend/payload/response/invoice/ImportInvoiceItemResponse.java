package com.bac.se.backend.payload.response.invoice;

import com.bac.se.backend.payload.response.product.ProductImportInvoiceResponse;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

public record ImportInvoiceItemResponse(
        String name,
        BigDecimal total,
        List<ProductImportInvoiceResponse> productItems,
        Date createdAt
) {
}
