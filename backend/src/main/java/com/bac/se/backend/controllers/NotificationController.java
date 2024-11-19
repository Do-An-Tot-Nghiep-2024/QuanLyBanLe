package com.bac.se.backend.controllers;

import com.bac.se.backend.payload.response.common.ApiResponse;
import com.bac.se.backend.payload.response.notification.NotificationResponse;
import com.bac.se.backend.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;


    @GetMapping("/sent")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'EMPLOYEE')")
    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getSentNotifications() {
        try {
            return ResponseEntity.ok(new ApiResponse<>("success",
                    notificationService.getSentNotifications()));
        } catch (Exception e) {
            return ResponseEntity.status(
                    HttpStatus.INTERNAL_SERVER_ERROR
            ).body(new ApiResponse<>(e.getMessage(), null));
        }
    }


}
