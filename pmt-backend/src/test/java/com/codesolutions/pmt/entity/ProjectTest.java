package com.codesolutions.pmt.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ProjectTest {

    private Project project;

    @BeforeEach
    void setUp() {
        project = new Project();
        project.setId(1L);
        project.setName("Test Project");
        project.setDescription("Description du projet");
        project.setStartDate(LocalDate.of(2024, 1, 1));
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void testProjectGettersAndSetters() {
        // Given
        Project p = new Project();
        LocalDateTime now = LocalDateTime.now();
        LocalDate start = LocalDate.of(2024, 1, 1);

        // When
        p.setId(2L);
        p.setName("Projet 2");
        p.setDescription("Desc 2");
        p.setStartDate(start);
        p.setCreatedAt(now);
        p.setUpdatedAt(now);

        // Then
        assertEquals(2L, p.getId());
        assertEquals("Projet 2", p.getName());
        assertEquals("Desc 2", p.getDescription());
        assertEquals(start, p.getStartDate());
        assertEquals(now, p.getCreatedAt());
        assertEquals(now, p.getUpdatedAt());
    }

    @Test
    void testProjectToString() {
        // When
        String result = project.toString();

        // Then
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertTrue(result.contains("Test Project"));
    }

    @Test
    void testProjectMembers() {
        // Given
        ProjectMember member = new ProjectMember();
        member.setId(1L);
        List<ProjectMember> members = new ArrayList<>();
        members.add(member);

        // When
        project.setMembers(members);

        // Then
        assertNotNull(project.getMembers());
        assertEquals(1, project.getMembers().size());
        assertEquals(1L, project.getMembers().get(0).getId());
    }

    @Test
    void testProjectTasks() {
        // Given
        Task task = new Task();
        task.setId(1L);
        List<Task> tasks = new ArrayList<>();
        tasks.add(task);

        // When
        project.setTasks(tasks);

        // Then
        assertNotNull(project.getTasks());
        assertEquals(1, project.getTasks().size());
        assertEquals(1L, project.getTasks().get(0).getId());
    }

    @Test
    void testProjectGettersSetters() {
        Project project = new Project();
        project.setId(1L);
        project.setName("Test Project");
        project.setDescription("Description");
        project.setStartDate(java.time.LocalDate.now());
        project.setCreatedBy(null);

        assertEquals(1L, project.getId());
        assertEquals("Test Project", project.getName());
        assertEquals("Description", project.getDescription());
        assertNotNull(project.getStartDate());
        assertNull(project.getCreatedBy());
    }
} 