package com.bac.se.backend.keys;


import com.bac.se.backend.models.Order;
import com.bac.se.backend.models.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemKey{
    private Product product;
    private Order order;
}
