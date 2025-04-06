package com.ezgi.taskmanager.repository;

import com.ezgi.taskmanager.model.Notification;
import com.ezgi.taskmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientOrderByCreatedAtDesc(User recipient);
}
