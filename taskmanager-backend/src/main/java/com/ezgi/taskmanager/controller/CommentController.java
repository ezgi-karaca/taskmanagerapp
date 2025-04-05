package com.ezgi.taskmanager.controller;

import com.ezgi.taskmanager.dto.CommentRequestDto;
import com.ezgi.taskmanager.dto.CommentResponseDto;
import com.ezgi.taskmanager.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentResponseDto> addComment(
            @RequestBody CommentRequestDto dto,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        CommentResponseDto response = commentService.addComment(dto, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<CommentResponseDto>> getCommentsByTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(commentService.getCommentsByTask(taskId));
    }
}
