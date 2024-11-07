package com.bac.se.backend.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "t_category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long id;
    @Column(unique = true)
    private String name;
    @OneToMany(mappedBy = "category")
    private List<Product> products;
    // set default value
    private boolean isActive;
}
