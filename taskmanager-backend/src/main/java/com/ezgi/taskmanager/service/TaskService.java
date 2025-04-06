package com.ezgi.taskmanager.service;

import com.ezgi.taskmanager.dto.AssignedUserDto;
import com.ezgi.taskmanager.dto.TaskProjectDto;
import com.ezgi.taskmanager.dto.TaskResponseDto;
import com.ezgi.taskmanager.model.Project;
import com.ezgi.taskmanager.model.Task;
import com.ezgi.taskmanager.model.TaskStatus;
import com.ezgi.taskmanager.model.User;
import com.ezgi.taskmanager.repository.TaskRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private NotificationService notificationService;


    public TaskResponseDto convertToDto(Task task) {
        TaskResponseDto dto = new TaskResponseDto();

        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setDueDate(task.getDueDate());
        dto.setStatus(task.getStatus());
        dto.setEmployeeComment(task.getEmployeeComment());

        AssignedUserDto userDto = new AssignedUserDto();
        userDto.setId(task.getAssignedTo().getId());
        userDto.setUsername(task.getAssignedTo().getUsername());
        dto.setAssignedTo(userDto);

        TaskProjectDto projectDto = new TaskProjectDto();
        projectDto.setId(task.getProject().getId());
        projectDto.setName(task.getProject().getName());
        dto.setProject(projectDto);

        if (task.getCreatedBy() != null) {
            dto.setCreatedByUsername(task.getCreatedBy().getUsername());
        }

        return dto;
    }

    public List<TaskResponseDto> convertToDtoList(List<Task> tasks) {
        return tasks.stream()
                .map(this::convertToDto)
                .toList();
    }



    public Task createTask(Task task, String creatorUsername) {
        Long userId = task.getAssignedTo().getId();
        Long projectId = task.getProject().getId();

        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = projectService.getProjectById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User creator = userService.findByUsername(creatorUsername)
                .orElseThrow(() -> new RuntimeException("Creator not found"));

        task.setAssignedTo(user);
        task.setProject(project);
        task.setCreatedBy(creator);

        Task savedTask = taskRepository.save(task);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(user.getEmail());
            helper.setSubject("📌 New Task Assigned: " + task.getTitle());

            String htmlContent = """
            <html>
                <body style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #2a7ae2;">📝 A New Task Has Been Assigned to You!</h2>
                    <p>Hello <strong>%s</strong>,</p>
                    <p>A new task has been assigned to you in the project <strong>%s</strong>.</p>
                    <table style="border-collapse: collapse; width: 100%%; margin-top: 20px;">
                        <tr>
                            <td style="padding: 8px; background-color: #f0f0f0;"><strong>Title</strong></td>
                            <td style="padding: 8px;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; background-color: #f0f0f0;"><strong>Description</strong></td>
                            <td style="padding: 8px;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; background-color: #f0f0f0;"><strong>Due Date</strong></td>
                            <td style="padding: 8px;">%s</td>
                        </tr>
                    </table>
                    <p style="margin-top: 20px;">Please check your task panel to start working on it.</p>
                    <p style="margin-top: 30px;">Best regards,<br><em>Task Manager System</em></p>
                </body>
            </html>
        """.formatted(
                    user.getUsername(),
                    project.getName(),
                    task.getTitle(),
                    task.getDescription(),
                    task.getDueDate()
            );

            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("Email could not be sent: " + e.getMessage());
        }

        notificationService.sendNotification(
                "New Task Assigned",
                "Task: " + task.getTitle() + " has been assigned to you.",
                user
        );



        return savedTask;
    }

    public List<Task> getAllSortedTasks() {
        return taskRepository.findAllSortedByStatusAndDueDate();
    }

    public List<Task> getTasksByUserSorted(User user) {
        return taskRepository.findByAssignedToOrderByStatusAndDueDate(user);
    }





    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public List<Task> getTasksByUser(User user) {
        return taskRepository.findByAssignedTo(user);
    }

    public List<Task> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status);
    }

    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public Task updateTask(Task updatedTask) {

        Task existingTask = taskRepository.findById(updatedTask.getId())
                .orElseThrow(() -> new RuntimeException("Task not found"));

        existingTask.setTitle(updatedTask.getTitle());
        existingTask.setDescription(updatedTask.getDescription());
        existingTask.setDueDate(updatedTask.getDueDate());
        existingTask.setStatus(updatedTask.getStatus());
        existingTask.setEmployeeComment(updatedTask.getEmployeeComment());

        Task saved = taskRepository.save(existingTask);

        notificationService.sendNotification(
                "Task Updated",
                "Task: " + saved.getTitle() + " has been updated.",
                saved.getAssignedTo()
        );


        return saved;
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public Task markAsCompleted(Long taskId, String comment) {
        Task task = taskRepository.findById(taskId).orElseThrow(() ->
                new RuntimeException("Task not found"));
        task.setStatus(TaskStatus.COMPLETED);
        task.setEmployeeComment(comment);

        notificationService.sendNotification(
                "Task Completed",
                "Task: " + task.getTitle() + " has been completed by " + task.getAssignedTo().getUsername(),
                task.getAssignedTo()
        );


        return taskRepository.save(task);
    }

    public Task markAsInProgress(Long taskId) {
        Task task = taskRepository.findById(taskId).orElseThrow(() ->
                new RuntimeException("Task not found"));
        task.setStatus(TaskStatus.IN_PROGRESS);

        notificationService.sendNotification(
                "Task In Progress",
                "Task: " + task.getTitle() + " is now in progress by " + task.getAssignedTo().getUsername(),
                task.getAssignedTo()
        );


        return taskRepository.save(task);
    }

    public List<Task> filterTasks(TaskStatus status, LocalDate dueDate, String keyword) {
        if (keyword != null && !keyword.isBlank()) {
            return taskRepository.findByKeyword(keyword).stream()
                    .filter(t -> (status == null || t.getStatus() == status))
                    .filter(t -> (dueDate == null || t.getDueDate().equals(dueDate)))
                    .toList();
        } else {
            return taskRepository.findByStatusAndDueDate(status, dueDate);
        }
    }

    public List<Task> getTasksByUserId(Long userId) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return taskRepository.findByAssignedTo(user);
    }



}
