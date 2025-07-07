package com.codesolutions.pmt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ProjectDTO {
    
    private Long id;
    
    @NotBlank(message = "Le nom du projet est obligatoire")
    @Size(max = 100, message = "Le nom du projet ne peut pas dépasser 100 caractères")
    private String name;
    
    private String description;
    
    @NotNull(message = "La date de début est obligatoire")
    private LocalDate startDate;
    
    private Long createdById;
    private String createdByUsername;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Statistiques du projet
    private Long taskCount;
    private Long memberCount;
    private List<ProjectMemberDTO> members;
    
    // Constructeurs
    public ProjectDTO() {}
    
    public ProjectDTO(Long id, String name, String description, LocalDate startDate,
                      Long createdById, String createdByUsername,
                      LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.createdById = createdById;
        this.createdByUsername = createdByUsername;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    public ProjectDTO(String name, String description, LocalDate startDate) {
        this.name = name;
        this.description = description;
        this.startDate = startDate;
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDate getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    
    public Long getCreatedById() {
        return createdById;
    }
    
    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }
    
    public String getCreatedByUsername() {
        return createdByUsername;
    }
    
    public void setCreatedByUsername(String createdByUsername) {
        this.createdByUsername = createdByUsername;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Long getTaskCount() {
        return taskCount;
    }
    
    public void setTaskCount(Long taskCount) {
        this.taskCount = taskCount;
    }
    
    public Long getMemberCount() {
        return memberCount;
    }
    
    public void setMemberCount(Long memberCount) {
        this.memberCount = memberCount;
    }
    
    public List<ProjectMemberDTO> getMembers() {
        return members;
    }
    
    public void setMembers(List<ProjectMemberDTO> members) {
        this.members = members;
    }
    
    @Override
    public String toString() {
        return "ProjectDto{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", startDate=" + startDate +
                ", createdByUsername='" + createdByUsername + '\'' +
                ", taskCount=" + taskCount +
                ", memberCount=" + memberCount +
                '}';
    }
} 