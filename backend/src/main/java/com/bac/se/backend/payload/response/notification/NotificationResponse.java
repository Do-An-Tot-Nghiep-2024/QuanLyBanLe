package com.bac.se.backend.payload.response.notification;

import java.util.Date;

public record NotificationResponse(
        Long id,
        String content,
        Date createdAt
) {
}
