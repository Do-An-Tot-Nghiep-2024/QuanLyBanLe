package com.bac.se.backend.models;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
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
    private int notifyQuantity; // số lượng sản càn còn lại nếu bằng với notifyQuantity thì gửi thông báo cho người dùng

}
