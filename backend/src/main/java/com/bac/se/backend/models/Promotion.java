package com.bac.se.backend.models;

import com.bac.se.backend.enums.PromotionScope;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "t_promotion")
public class Promotion {
    @Id
    @Column(name = "promotion_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private Date startDate;
    private Date endDate;
    @Enumerated(EnumType.STRING)
    private PromotionScope scope;


    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "promotion_type_id")
    private PromotionType promotionType;

    @OneToMany(mappedBy = "promotion")
    private List<Product> products;
}
