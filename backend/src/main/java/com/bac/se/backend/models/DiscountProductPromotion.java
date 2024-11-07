package com.bac.se.backend.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "t_discount_product_promotion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiscountProductPromotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "promotion_rule_id")
    private Long id;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;
    private double discount;
}
