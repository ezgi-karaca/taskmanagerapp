package com.ezgi.taskmanager.service;

import com.ezgi.taskmanager.model.Notification;
import com.ezgi.taskmanager.model.NotificationMessage;
import com.ezgi.taskmanager.model.User;
import com.ezgi.taskmanager.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class NotificationService {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationRepository notificationRepository;

    public void sendNotification(String title, String content, User recipient) {

        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setContent(content);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRecipient(recipient);
        notification.setRead(false);
        notificationRepository.save(notification);


        NotificationMessage message = new NotificationMessage(title, content);
        messagingTemplate.convertAndSend("/topic/notifications", message);
    }


}
