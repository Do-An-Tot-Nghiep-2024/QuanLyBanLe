package com.bac.se.backend.mapper;

import com.bac.se.backend.payload.response.order.OrderEmployeeResponse;
import com.bac.se.backend.payload.response.order.OrderItemQueryResponse;
import com.bac.se.backend.payload.response.order.OrderResponse;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class OrderMapper {

    public OrderResponse mapObjectToResponse(Object[] order) {
        return new OrderResponse(
                Long.parseLong(order[0].toString()), // id
                order[1].toString(), // employee
                Double.parseDouble(order[2].toString()), // total
                order[3].toString(), // order status
                order[4].toString(), // payment type
                (Date) order[5] // date
        );
    }

    public OrderItemQueryResponse mapObjectToOrderItem(Object[] orderItem) {
        return new OrderItemQueryResponse(
                Double.parseDouble(orderItem[0].toString()),
                orderItem[1].toString(),
                Integer.parseInt(orderItem[2].toString()),
                Double.parseDouble(orderItem[3].toString())
        );
    }

    public OrderEmployeeResponse mapObjectToEmployee(Object[] orderEmployee) {
        return new OrderEmployeeResponse(
                orderEmployee[0].toString(),
                orderEmployee[1].toString()
        );
    }

}
