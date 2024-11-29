package com.bac.se.backend.services;

import com.bac.se.backend.payload.response.notification.NotificationResponse;

import java.util.List;


public interface NotificationService {
    NotificationResponse createNotification(String content);


    List<NotificationResponse> getSentNotifications();

    String readNotification(Long id);

}
