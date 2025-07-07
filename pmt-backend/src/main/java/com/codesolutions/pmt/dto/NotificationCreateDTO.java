package com.codesolutions.pmt.dto;

public class NotificationCreateDTO {
    private String title;
    private String message;
    private String type;
    private Long userId;
    private Long projectId;
    private Long taskId;

    // Constructeurs
    public NotificationCreateDTO() {}

    public NotificationCreateDTO(String title, String message, String type, Long userId) {
        this.title = title;
        this.message = message;
        this.type = type;
        this.userId = userId;
    }

    // Getters et Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }
} 