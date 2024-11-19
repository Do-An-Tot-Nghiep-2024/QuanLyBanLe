package com.bac.se.backend.repositories;

import com.bac.se.backend.enums.NotificationStatus;
import com.bac.se.backend.models.Notification;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification,Long> {

    List<Notification> getNotificationsByStatus(NotificationStatus status, Pageable pageable);
}
