package com.bac.se.backend.models;

import com.bac.se.backend.enums.NotificationStatus;
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
@Table(name = "t_notification")
public class Notification {
    @Id
    @Column(name = "notification_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String content;
    private Date sentAt;
    @Enumerated(EnumType.STRING)
    private NotificationStatus status;

    @OneToMany(mappedBy = "notification")
    private List<Employee> employees;

}
