package com.bac.se.backend.models;

import com.bac.se.backend.keys.OrderItemKey;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(OrderItemKey.class)
@Builder
@Entity
@Table(name = "t_order_item")
public class OrderItem {
    private int quantity;
    private BigDecimal totalPrice;
    @Id
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
    @Id
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
}
