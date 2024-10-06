package com.bac.se.backend.keys;


import com.bac.se.backend.models.Order;
import com.bac.se.backend.models.Product;
import lombok.Data;


@Data
public class OrderItemKey{
    private Product product;
    private Order order;
}
