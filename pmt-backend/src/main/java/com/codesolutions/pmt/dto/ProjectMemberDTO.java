package com.codesolutions.pmt.dto;

import java.time.LocalDateTime;

public class ProjectMemberDTO {
    private Long id;
    private Long projectId;
    private String projectName;
    private Long userId;
    private String username;
    private String email;
    private Integer roleId;
    private String roleName;
    private LocalDateTime joinedAt;

    // Constructeurs
    public ProjectMemberDTO() {}
    
    public ProjectMemberDTO(Long id, Long projectId, String projectName, Long userId, String username,
                            String email, Integer roleId, String roleName, LocalDateTime joinedAt) {
        this.id = id;
        this.projectId = projectId;
        this.projectName = projectName;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.roleId = roleId;
        this.roleName = roleName;
        this.joinedAt = joinedAt;
    }
    
    public ProjectMemberDTO(Long userId, String username, String email, Integer roleId, String roleName) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.roleId = roleId;
        this.roleName = roleName;
    }

    public ProjectMemberDTO(Long id, Long id1, Long id2, String username, String email, String name, Integer id3, LocalDateTime joinedAt) {
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getProjectId() {
        return projectId;
    }
    
    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
    
    public String getProjectName() {
        return projectName;
    }
    
    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public Integer getRoleId() {
        return roleId;
    }
    
    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }
    
    public String getRoleName() {
        return roleName;
    }
    
    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
    
    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }
    
    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
    
    @Override
    public String toString() {
        return "ProjectMemberDto{" +
                "id=" + id +
                ", projectId=" + projectId +
                ", projectName='" + projectName + '\'' +
                ", userId=" + userId +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", roleId=" + roleId +
                ", roleName='" + roleName + '\'' +
                ", joinedAt=" + joinedAt +
                '}';
    }
} 