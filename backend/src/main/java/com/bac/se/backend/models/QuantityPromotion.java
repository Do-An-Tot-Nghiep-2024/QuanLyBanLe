package com.bac.se.backend.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "t_quantity_promotion")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuantityPromotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "promotion_rule_id")
    private Long id;
    private int buyQuantity;
    private int freeQuantity;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;
}
