package com.ezgi.taskmanager.controller;

import com.ezgi.taskmanager.dto.UserResponseDto;
import com.ezgi.taskmanager.model.User;
import com.ezgi.taskmanager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('MANAGER')")
    public List<UserResponseDto> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return users.stream()
                .map(user -> new UserResponseDto(user.getId(), user.getUsername(), user.getRole().name()))
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/employees")
    public List<UserResponseDto> getAllEmployees() {
        List<User> employees = userService.findAllEmployees();
        return employees.stream()
                .map(userService::convertToDto)
                .toList();
    }

}
