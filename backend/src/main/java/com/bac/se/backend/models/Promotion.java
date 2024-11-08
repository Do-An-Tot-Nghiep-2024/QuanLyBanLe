package com.bac.se.backend.models;

import com.bac.se.backend.enums.PromotionScope;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.util.Date;
import java.util.List;

@Getter
@Setter
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
    private int orderLimit;
    @ColumnDefault("true")
    private boolean isActive;
    @Enumerated(EnumType.STRING)
    private PromotionScope scope;


    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "promotion_type_id")
    private PromotionType promotionType;

    @OneToMany(mappedBy = "promotion")
    private List<Product> products;
}
