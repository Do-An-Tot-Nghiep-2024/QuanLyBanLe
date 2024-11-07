package com.bac.se.backend.models;

import com.bac.se.backend.enums.EmployeeStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "t_employee")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id")
    private Long id;
    private String name;
    @Column(length = 10,unique = true)
    private String phone;
    @Column(length = 150,unique = true)
    private String email;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date dob;

    @Enumerated(EnumType.STRING)
    private EmployeeStatus status;

    @OneToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @OneToMany(mappedBy = "employee")
    private List<Order> orders;
}
