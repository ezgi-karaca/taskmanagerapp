package com.ezgi.taskmanager.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ProjectResponseDto {
    private Long id;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String createdByUsername;
}
