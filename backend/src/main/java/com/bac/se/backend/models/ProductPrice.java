package com.bac.se.backend.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "t_product_price")
public class ProductPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_price_id")
    private Long id;
    private double originalPrice;
    private double price;
    private Date createdAt;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
}
