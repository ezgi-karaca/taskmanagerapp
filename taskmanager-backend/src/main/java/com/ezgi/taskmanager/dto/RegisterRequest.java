package com.ezgi.taskmanager.dto;

import com.ezgi.taskmanager.model.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private Role role;
}
