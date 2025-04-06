package com.ezgi.taskmanager.service;


import com.ezgi.taskmanager.dto.RegisterRequest;
import com.ezgi.taskmanager.dto.UserResponseDto;
import com.ezgi.taskmanager.model.Role;
import com.ezgi.taskmanager.model.User;
import com.ezgi.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());

        if (request.getRole() == Role.EMPLOYEE || request.getRole() == Role.MANAGER) {
            user.setRole(request.getRole());
        } else {
            throw new RuntimeException("Geçersiz rol: " + request.getRole());
        }

        return userRepository.save(user);
    }

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    public List<User> findAllEmployees() {
        return userRepository.findByRole(Role.EMPLOYEE);
    }

    public UserResponseDto convertToDto(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        return dto;
    }




    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }


}
