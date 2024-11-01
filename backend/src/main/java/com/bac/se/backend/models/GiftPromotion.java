package com.bac.se.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "t_gift_promotion")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class GiftPromotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "promotion_rule_id")
    private Long id;
    private int buyQuantity;
    private int giftQuantity;
    private Long giftProductId;
    private Long giftShipmentId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;
}
