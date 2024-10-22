package com.bac.se.backend.mapper;

import com.bac.se.backend.payload.response.invoice.ImportInvoice;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;

@Service
public class InvoiceMapper {
    public ImportInvoice mapObjectToImportInvoice(Object[] obj) {
        return new ImportInvoice(
                "HDNH-" + Long.parseLong(obj[0].toString()),
                obj[1].toString(), // name supplier,
                (Date) obj[2],
                BigDecimal.valueOf(Double.parseDouble(obj[3].toString()))
        );
    }
}
