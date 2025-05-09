package com.ezgi.taskmanager.service;

import com.ezgi.taskmanager.dto.ProjectResponseDto;
import com.ezgi.taskmanager.model.Project;
import com.ezgi.taskmanager.model.User;
import com.ezgi.taskmanager.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserService userService;

    public ProjectResponseDto convertToDto(Project project) {
        ProjectResponseDto dto = new ProjectResponseDto();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setStartDate(project.getStartDate());
        dto.setEndDate(project.getEndDate());
        dto.setCreatedByUsername(project.getCreatedBy().getUsername());
        return dto;
    }

    public List<ProjectResponseDto> convertToDtoList(List<Project> projects) {
        return projects.stream()
                .map(this::convertToDto)
                .toList();
    }



    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public Project createProject(Project project){
        return projectRepository.save(project);
    }




    public Project updateProject(Long id, Project updatedProject){
        Optional<Project> existingProjectOpt = projectRepository.findById(id);

        if (existingProjectOpt.isPresent()) {
            Project existingProject = existingProjectOpt.get();
            existingProject.setName(updatedProject.getName());
            existingProject.setDescription(updatedProject.getDescription());
            existingProject.setStartDate(updatedProject.getStartDate());
            existingProject.setEndDate(updatedProject.getEndDate());

            return projectRepository.save(existingProject);
        } else {
            throw new RuntimeException("Proje bulunamadı");
        }

    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }




}
