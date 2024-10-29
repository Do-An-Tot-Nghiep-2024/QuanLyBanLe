package com.bac.se.backend.payload.response.invoice;

import java.math.BigDecimal;

public record ImportInvoice(String numberInvoice,String name, String createdAt, BigDecimal total) {

}
