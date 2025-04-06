package com.ezgi.taskmanager.controller;


import com.ezgi.taskmanager.dto.ProjectResponseDto;
import com.ezgi.taskmanager.model.Project;
import com.ezgi.taskmanager.model.User;
import com.ezgi.taskmanager.service.ProjectService;
import com.ezgi.taskmanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    @GetMapping
    public List<ProjectResponseDto> getAllProjects() {
        return projectService.convertToDtoList(projectService.getAllProjects());
    }




    @GetMapping("/{id}")
    public ProjectResponseDto getProjectById(@PathVariable Long id) {
        Project project = projectService.getProjectById(id)
                .orElseThrow(() -> new RuntimeException("There is no project with this id."));
        return projectService.convertToDto(project);
    }


    @PostMapping
    public ProjectResponseDto createProject(@RequestBody Project project,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        User creator = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        project.setCreatedBy(creator);
        Project saved = projectService.createProject(project);
        return projectService.convertToDto(saved);
    }




    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project updatedProject) {
        return projectService.updateProject(id, updatedProject);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }
}
