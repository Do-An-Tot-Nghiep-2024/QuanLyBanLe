package com.bac.se.backend.payload.response.order;

import java.math.BigDecimal;
import java.util.List;

public record OrderCustomerResponse(String employeeName,
                                    String employeePhone,
                                    List<OrderItemQueryResponse> queryResponses,
                                    BigDecimal total) {
}
