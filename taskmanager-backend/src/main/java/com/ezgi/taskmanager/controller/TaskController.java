package com.ezgi.taskmanager.controller;


import com.ezgi.taskmanager.dto.TaskResponseDto;
import com.ezgi.taskmanager.model.Task;
import com.ezgi.taskmanager.model.TaskStatus;
import com.ezgi.taskmanager.model.User;
import com.ezgi.taskmanager.service.TaskService;
import com.ezgi.taskmanager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;
    private final UserService userService;

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping
    public TaskResponseDto createTask(@RequestBody Task task,
                                      @AuthenticationPrincipal UserDetails userDetails) {
        Task created = taskService.createTask(task, userDetails.getUsername());
        return taskService.convertToDto(created);
    }



    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public List<TaskResponseDto> getAllTasks() {
        List<Task> tasks = taskService.getAllSortedTasks();
        return taskService.convertToDtoList(tasks);
    }



    @PreAuthorize("isAuthenticated()")
    @GetMapping("/my")
    public List<TaskResponseDto> getMyTasks(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Task> tasks = taskService.getTasksByUserSorted(user);
        return taskService.convertToDtoList(tasks);
    }



    @PreAuthorize("isAuthenticated()")
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TaskResponseDto>> getByProject(@PathVariable Long projectId) {
        List<Task> tasks = taskService.getTasksByProject(projectId);
        return ResponseEntity.ok(taskService.convertToDtoList(tasks));
    }


    @PreAuthorize("hasRole('EMPLOYEE')")
    @PatchMapping("/{id}/in-progress")
    public ResponseEntity<TaskResponseDto> markInProgress(@PathVariable Long id) {
        Task updatedTask = taskService.markAsInProgress(id);
        TaskResponseDto dto = taskService.convertToDto(updatedTask);
        return ResponseEntity.ok(dto);
    }




    @PreAuthorize("hasRole('EMPLOYEE')")
    @PatchMapping("/{id}/complete")
    public ResponseEntity<TaskResponseDto> markAsCompleted(
            @PathVariable Long id,
            @RequestBody String comment
    ) {
        Task updatedTask = taskService.markAsCompleted(id, comment);
        TaskResponseDto dto = taskService.convertToDto(updatedTask);
        return ResponseEntity.ok(dto);
    }


    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping
    public ResponseEntity<Task> updateTask(@RequestBody Task task) {
        return ResponseEntity.ok(taskService.updateTask(task));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/filter")
    public ResponseEntity<List<TaskResponseDto>> filterTasks(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) LocalDate dueDate,
            @RequestParam(required = false) String keyword
    ) {
        List<Task> filtered = taskService.filterTasks(status, dueDate, keyword);
        return ResponseEntity.ok(taskService.convertToDtoList(filtered));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/assigned/{userId}")
    public ResponseEntity<List<TaskResponseDto>> getTasksByAssignedUser(@PathVariable Long userId) {
        List<Task> tasks = taskService.getTasksByUserId(userId);
        return ResponseEntity.ok(taskService.convertToDtoList(tasks));
    }


}
