package com.codesolutions.pmt.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("password123");
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void testUserGettersAndSetters() {
        // Given
        User testUser = new User();
        LocalDateTime now = LocalDateTime.now();

        // When
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("password123");
        testUser.setCreatedAt(now);
        testUser.setUpdatedAt(now);

        // Then
        assertEquals(1L, testUser.getId());
        assertEquals("testuser", testUser.getUsername());
        assertEquals("test@example.com", testUser.getEmail());
        assertEquals("password123", testUser.getPassword());
        assertEquals(now, testUser.getCreatedAt());
        assertEquals(now, testUser.getUpdatedAt());
    }

    @Test
    void testUserConstructor() {
        // When
        User testUser = new User("testuser", "test@example.com", "password123");

        // Then
        assertEquals("testuser", testUser.getUsername());
        assertEquals("test@example.com", testUser.getEmail());
        assertEquals("password123", testUser.getPassword());
        // Les dates sont définies par les annotations @CreationTimestamp et @UpdateTimestamp
        // donc elles peuvent être null dans le constructeur
    }

    @Test
    void testUserToString() {
        // When
        String result = user.toString();

        // Then
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertTrue(result.contains("testuser"));
    }

    @Test
    void testUserCreatedProjects() {
        // Given
        Project project = new Project();
        project.setId(1L);
        project.setName("Test Project");
        List<Project> projects = new ArrayList<>();
        projects.add(project);

        // When
        user.setCreatedProjects(projects);

        // Then
        assertNotNull(user.getCreatedProjects());
        assertEquals(1, user.getCreatedProjects().size());
        assertEquals("Test Project", user.getCreatedProjects().get(0).getName());
    }

    @Test
    void testUserAssignedTasks() {
        // Given
        Task task = new Task();
        task.setId(1L);
        task.setTitle("Test Task");
        List<Task> tasks = new ArrayList<>();
        tasks.add(task);

        // When
        user.setAssignedTasks(tasks);

        // Then
        assertNotNull(user.getAssignedTasks());
        assertEquals(1, user.getAssignedTasks().size());
        assertEquals("Test Task", user.getAssignedTasks().get(0).getTitle());
    }

    @Test
    void testUserCreatedTasks() {
        // Given
        Task task = new Task();
        task.setId(1L);
        task.setTitle("Test Task");
        List<Task> tasks = new ArrayList<>();
        tasks.add(task);

        // When
        user.setCreatedTasks(tasks);

        // Then
        assertNotNull(user.getCreatedTasks());
        assertEquals(1, user.getCreatedTasks().size());
        assertEquals("Test Task", user.getCreatedTasks().get(0).getTitle());
    }

    @Test
    void testUserGettersSetters() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("password");

        assertEquals(1L, user.getId());
        assertEquals("testuser", user.getUsername());
        assertEquals("test@example.com", user.getEmail());
        assertEquals("password", user.getPassword());
    }
} 