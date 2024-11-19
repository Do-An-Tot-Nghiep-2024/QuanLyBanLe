package com.bac.se.backend.services.impl;

import com.bac.se.backend.enums.NotificationStatus;
import com.bac.se.backend.models.Notification;
import com.bac.se.backend.payload.response.notification.NotificationResponse;
import com.bac.se.backend.repositories.NotificationRepository;
import com.bac.se.backend.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public NotificationResponse createNotification(String content) {
        Notification notification = Notification.builder()
                .content(content)
                .status(NotificationStatus.SENT)
                .sentAt(new Date())
                .build();
        var save = notificationRepository.save(notification);
        return new NotificationResponse(save.getId(), save.getContent(), save.getSentAt());
    }

    @Override
    public List<NotificationResponse> getSentNotifications() {
        List<Notification> notificationsByStatus = notificationRepository.getNotificationsByStatus(
                NotificationStatus.SENT,
                PageRequest.of(0,5, Sort.Direction.DESC,"id"));
        return notificationsByStatus.stream().map(notification -> new NotificationResponse(notification.getId(),
                notification.getContent(), notification.getSentAt())).toList();
    }
}
