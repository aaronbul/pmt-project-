package com.codesolutions.pmt.dto;

import com.codesolutions.pmt.entity.TaskPriority;
import com.codesolutions.pmt.entity.TaskStatusEnum;

import java.time.LocalDate;

public class TaskUpdateDTO {
    private String title;
    private String description;
    private String status;
    private TaskPriority priority;
    private LocalDate dueDate;
    private Long assignedToId;

    // Constructeurs
    public TaskUpdateDTO() {}

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // Méthode pour convertir la chaîne en TaskStatusEnum
    public TaskStatusEnum getStatusEnum() {
        if (status == null) {
            return null;
        }
        try {
            return TaskStatusEnum.valueOf(status);
        } catch (IllegalArgumentException e) {
            // Retourner TODO par défaut si le statut n'est pas reconnu
            return TaskStatusEnum.TODO;
        }
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

    public Long getAssignedToId() {
        return assignedToId;
    }

    public void setAssignedToId(Long assignedToId) {
        this.assignedToId = assignedToId;
    }
} 