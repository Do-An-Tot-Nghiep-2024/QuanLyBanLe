package com.bac.se.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "t_stock")
public class Stock {
    @Id
    @Column(name = "stock_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int quantity;
    private int soldQuantity;
    private int failedQuantity;
    private int notifyQuantity; // số lượng sản càn còn lại nếu bằng với notifyQuantity thì gửi thông báo cho người dùng
    @OneToOne
    @JoinColumn(name = "product_id")
    private Product product;

}
