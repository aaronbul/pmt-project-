package com.codesolutions.pmt.dto;

import com.codesolutions.pmt.entity.TaskPriority;
import com.codesolutions.pmt.entity.TaskStatusEnum;

import java.time.LocalDate;

public class TaskCreateDTO {
    private String title;
    private String description;
    private TaskStatusEnum status;
    private TaskPriority priority;
    private LocalDate dueDate;
    private Long projectId;
    private Long assignedToId;
    private Long createdById;

    // Constructeurs
    public TaskCreateDTO() {}

    public TaskCreateDTO(String title, String description, Long projectId) {
        this.title = title;
        this.description = description;
        this.projectId = projectId;
        this.status = TaskStatusEnum.TODO; // Statut par défaut
        this.priority = TaskPriority.MEDIUM; // Priorité par défaut
    }

    // Getters et Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskStatusEnum getStatus() {
        return status;
    }

    public void setStatus(TaskStatusEnum status) {
        this.status = status;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Long getAssignedToId() {
        return assignedToId;
    }

    public void setAssignedToId(Long assignedToId) {
        this.assignedToId = assignedToId;
    }

    public Long getCreatedById() {
        return createdById;
    }

    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }
} 