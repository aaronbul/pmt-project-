package com.codesolutions.pmt.dto;

public class ProjectMemberCreateDTO {
    private Long projectId;
    private Long userId;
    private Integer roleId;

    // Constructeurs
    public ProjectMemberCreateDTO() {}

    public ProjectMemberCreateDTO(Long projectId, Long userId, Integer roleId) {
        this.projectId = projectId;
        this.userId = userId;
        this.roleId = roleId;
    }

    // Getters et Setters
    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }
} 