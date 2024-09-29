package com.bac.se.backend.keys;


import com.bac.se.backend.models.Order;
import com.bac.se.backend.models.Product;
import lombok.Data;

import java.io.Serializable;

@Data
public class OrderItemKey implements Serializable {
    private Product product;
    private Order order;
}
