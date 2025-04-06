package com.ezgi.taskmanager.dto;

import com.ezgi.taskmanager.model.TaskStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskResponseDto {
    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private TaskStatus status;
    private String employeeComment;
    private String createdByUsername;

    private AssignedUserDto assignedTo;
    private TaskProjectDto project;
}
