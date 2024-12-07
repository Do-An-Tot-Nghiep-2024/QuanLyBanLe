package com.bac.se.backend.mapper;

import com.bac.se.backend.payload.response.order.OrderEmployeeResponse;
import com.bac.se.backend.payload.response.order.OrderItemQueryResponse;
import com.bac.se.backend.payload.response.order.OrderItemResponse;
import com.bac.se.backend.payload.response.order.OrderResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;

@Service
public class OrderMapper {

    public OrderResponse mapObjectToResponse(Object[] order) {
        return new OrderResponse(
                Long.parseLong(order[0].toString()), // id
                order[1].toString(), // employee
                order[2].toString(), // order status
                order[3].toString(), // payment type
                Double.parseDouble(order[4].toString()), // total
                (Date) order[5], // date
                order[6] == null ? "" : order[6].toString() // customer phone
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

    public OrderItemResponse mapToOrderItemResponse(Object[] orderItem) {
        return new OrderItemResponse(
                Long.parseLong(orderItem[0].toString()), // id
                orderItem[1].toString(), // employee
                orderItem[2].toString(), // order status
                orderItem[3].toString(), // payment type
                Double.parseDouble(orderItem[4].toString()), // total
                Double.parseDouble(orderItem[5].toString()), // total discount
                Double.parseDouble(orderItem[6].toString()), // customer payment
                (Date) orderItem[7], // date
                orderItem[8] == null ? "" : orderItem[8].toString(),
                orderItem[9] == null ? 0 : Double.parseDouble(orderItem[9].toString()), // percentage
                orderItem[10] == null ? 0 : Double.parseDouble(orderItem[10].toString()), // min order value
                new ArrayList<>()
        );
    }

}
