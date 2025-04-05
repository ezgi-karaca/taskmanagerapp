package com.ezgi.taskmanager.dto;

import lombok.Data;

@Data
public class CommentRequestDto {
    private Long taskId;
    private String content;
}
