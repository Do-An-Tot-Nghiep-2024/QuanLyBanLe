package com.bac.se.backend.payload.response.invoice;

import java.math.BigDecimal;
import java.util.Date;

public record ImportInvoice(String numberInvoice,String name, Date createAt, BigDecimal total) {

}
