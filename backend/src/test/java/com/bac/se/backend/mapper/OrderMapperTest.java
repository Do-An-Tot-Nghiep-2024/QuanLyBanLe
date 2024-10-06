package com.bac.se.backend.mapper;

import com.bac.se.backend.payload.response.order.OrderEmployeeResponse;
import com.bac.se.backend.payload.response.order.OrderItemQueryResponse;
import com.bac.se.backend.payload.response.order.OrderResponse;
import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;

class OrderMapperTest {

    OrderMapper orderMapper = new OrderMapper();

    @Test
    void mapObjectToResponse() {
        Object[] order = new Object[]{"1", "John", 100.0, "COMPLETE","CASH", new Date(1640995200000L)};
        OrderResponse orderResponse = orderMapper.mapObjectToResponse(order);
        assertEquals(Long.parseLong(order[0].toString()), orderResponse.orderId());
        assertEquals(order[1].toString(), orderResponse.employee());
        assertEquals(Double.parseDouble(order[2].toString()), orderResponse.total());
        assertEquals(order[3].toString(), orderResponse.orderStatus());
        assertEquals(order[4].toString(), orderResponse.paymentType());
    }

    @Test
    void mapObjectToOrderItem() {
        Object[] orderItem = new Object[]{100.0, "Phone", 1, 100.0};
        OrderItemQueryResponse orderResponse = orderMapper.mapObjectToOrderItem(orderItem);
        assertEquals(orderItem[1].toString(), orderResponse.name());
        assertEquals(Integer.parseInt(orderItem[2].toString()), orderResponse.quantity());
        assertEquals(Double.parseDouble(orderItem[3].toString()), orderResponse.price());
    }

    @Test
    void mapObjectToEmployee() {
        Object[] orderEmployee = new Object[]{"John", "02141505215"};
        OrderEmployeeResponse orderResponse = orderMapper.mapObjectToEmployee(orderEmployee);
        assertEquals(orderEmployee[0].toString(), orderResponse.name());
        assertEquals(orderEmployee[1].toString(), orderResponse.phone());
    }
}