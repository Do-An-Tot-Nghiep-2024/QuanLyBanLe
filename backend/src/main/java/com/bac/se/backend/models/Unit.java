package com.bac.se.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "t_unit")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Unit implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "unit_id")
    private Long id;
    private String name;

    @OneToMany(mappedBy = "unit",cascade = CascadeType.ALL)
    private List<Product> products;
}
