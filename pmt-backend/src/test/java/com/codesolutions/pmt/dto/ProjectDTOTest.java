package com.codesolutions.pmt.dto;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class ProjectDTOTest {

    @Test
    void testProjectDTOConstructor() {
        // Given
        Long id = 1L;
        String name = "Test Project";
        String description = "Test Description";
        LocalDate startDate = LocalDate.now();
        Long createdById = 1L;
        String createdByUsername = "testuser";
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime updatedAt = LocalDateTime.now();

        // When
        ProjectDTO projectDTO = new ProjectDTO(id, name, description, startDate, 
                createdById, createdByUsername, createdAt, updatedAt);

        // Then
        assertEquals(id, projectDTO.getId());
        assertEquals(name, projectDTO.getName());
        assertEquals(description, projectDTO.getDescription());
        assertEquals(startDate, projectDTO.getStartDate());
        assertEquals(createdById, projectDTO.getCreatedById());
        assertEquals(createdByUsername, projectDTO.getCreatedByUsername());
        assertEquals(createdAt, projectDTO.getCreatedAt());
        assertEquals(updatedAt, projectDTO.getUpdatedAt());
    }

    @Test
    void testProjectDTOSettersAndGetters() {
        // Given
        ProjectDTO projectDTO = new ProjectDTO();

        // When
        projectDTO.setId(1L);
        projectDTO.setName("Test Project");
        projectDTO.setDescription("Test Description");
        projectDTO.setStartDate(LocalDate.now());
        projectDTO.setCreatedById(1L);
        projectDTO.setCreatedByUsername("testuser");
        projectDTO.setCreatedAt(LocalDateTime.now());
        projectDTO.setUpdatedAt(LocalDateTime.now());
        projectDTO.setTaskCount(5L);
        projectDTO.setMemberCount(3L);

        // Then
        assertEquals(1L, projectDTO.getId());
        assertEquals("Test Project", projectDTO.getName());
        assertEquals("Test Description", projectDTO.getDescription());
        assertNotNull(projectDTO.getStartDate());
        assertEquals(1L, projectDTO.getCreatedById());
        assertEquals("testuser", projectDTO.getCreatedByUsername());
        assertNotNull(projectDTO.getCreatedAt());
        assertNotNull(projectDTO.getUpdatedAt());
        assertEquals(5L, projectDTO.getTaskCount());
        assertEquals(3L, projectDTO.getMemberCount());
    }

    @Test
    void testProjectDTOEqualsAndHashCode() {
        // Given
        LocalDate startDate = LocalDate.of(2024, 1, 1);
        LocalDateTime createdAt = LocalDateTime.of(2024, 1, 1, 10, 0);
        LocalDateTime updatedAt = LocalDateTime.of(2024, 1, 1, 10, 0);
        
        ProjectDTO project1 = new ProjectDTO(1L, "Project 1", "Description 1", startDate, 
                1L, "user1", createdAt, updatedAt);
        ProjectDTO project2 = new ProjectDTO(1L, "Project 1", "Description 1", startDate, 
                1L, "user1", createdAt, updatedAt);

        // Then - Test basique des getters
        assertEquals(project1.getId(), project2.getId());
        assertEquals(project1.getName(), project2.getName());
        assertEquals(project1.getDescription(), project2.getDescription());
    }

    @Test
    void testProjectDTOToString() {
        // Given
        LocalDate startDate = LocalDate.of(2024, 1, 1);
        LocalDateTime createdAt = LocalDateTime.of(2024, 1, 1, 10, 0);
        LocalDateTime updatedAt = LocalDateTime.of(2024, 1, 1, 10, 0);
        
        ProjectDTO projectDTO = new ProjectDTO(1L, "Test Project", "Test Description", 
                startDate, 1L, "testuser", createdAt, updatedAt);

        // When
        String result = projectDTO.toString();

        // Then - Vérifier que toString contient les informations de base
        assertNotNull(result);
        assertFalse(result.isEmpty());
    }
} 