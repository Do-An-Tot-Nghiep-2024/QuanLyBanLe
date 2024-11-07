package com.bac.se.backend.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

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
    private double discountPrice;
    private Date createdAt;
    @ColumnDefault("false") // change to true if promotion
    private boolean isPromotion;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
}
