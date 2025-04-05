package com.ezgi.taskmanager.service;

import com.ezgi.taskmanager.model.NotificationMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendNotification(String title, String content) {
        NotificationMessage message = new NotificationMessage(title, content);
        messagingTemplate.convertAndSend("/topic/notifications", message);
    }
}
