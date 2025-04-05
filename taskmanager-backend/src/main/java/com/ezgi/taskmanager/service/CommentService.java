package com.ezgi.taskmanager.service;

import com.ezgi.taskmanager.dto.CommentRequestDto;
import com.ezgi.taskmanager.dto.CommentResponseDto;
import com.ezgi.taskmanager.model.Comment;
import com.ezgi.taskmanager.model.Task;
import com.ezgi.taskmanager.model.User;
import com.ezgi.taskmanager.repository.CommentRepository;
import com.ezgi.taskmanager.repository.TaskRepository;
import com.ezgi.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public CommentResponseDto addComment(CommentRequestDto dto, String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = taskRepository.findById(dto.getTaskId())
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Comment comment = new Comment();
        comment.setAuthor(author);
        comment.setTask(task);
        comment.setContent(dto.getContent());

        Comment saved = commentRepository.save(comment);

        return new CommentResponseDto(
                saved.getId(),
                saved.getContent(),
                saved.getAuthor().getUsername(),
                saved.getCreatedAt()
        );
    }

    public List<CommentResponseDto> getCommentsByTask(Long taskId) {
        List<Comment> comments = commentRepository.findByTaskId(taskId);
        return comments.stream().map(comment -> new CommentResponseDto(
                comment.getId(),
                comment.getContent(),
                comment.getAuthor().getUsername(),
                comment.getCreatedAt()
        )).collect(Collectors.toList());
    }
}
