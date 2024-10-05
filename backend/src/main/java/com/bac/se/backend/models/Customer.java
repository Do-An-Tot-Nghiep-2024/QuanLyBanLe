package com.bac.se.backend.models;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "t_customer")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Long id;
    private String name;
    @Column(length = 100)
    private String email;
    @Column(length = 10)
    private String phone;
    @OneToOne
    @JoinColumn(name = "account_id")
    private Account account;
    @OneToMany(mappedBy = "customer")
    private List<Order> orders;
}

