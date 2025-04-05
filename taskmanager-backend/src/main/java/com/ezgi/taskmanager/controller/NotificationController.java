package com.ezgi.taskmanager.controller;

import com.ezgi.taskmanager.model.NotificationMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NotificationController {
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/notify")
    public void sendNotification(NotificationMessage message) {
        messagingTemplate.convertAndSend("/topic/notifications", message);
    }
}
