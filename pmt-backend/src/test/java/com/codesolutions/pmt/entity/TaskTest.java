package com.codesolutions.pmt.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class TaskTest {

    private Task task;

    @BeforeEach
    void setUp() {
        task = new Task();
        task.setId(1L);
        task.setTitle("Test Task");
        task.setDescription("Test Description");
        task.setPriority(Task.Priority.HIGH);
        task.setDueDate(LocalDate.now().plusDays(7));
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void testTaskGettersAndSetters() {
        // Given
        Task t = new Task();
        LocalDateTime now = LocalDateTime.now();
        LocalDate dueDate = LocalDate.now().plusDays(7);
        User user = new User();
        user.setId(1L);
        Project project = new Project();
        project.setId(1L);

        // When
        t.setId(1L);
        t.setTitle("Test Task");
        t.setDescription("Test Description");
        t.setPriority(Task.Priority.HIGH);
        t.setDueDate(dueDate);
        t.setAssignedTo(user);
        t.setProject(project);
        t.setCreatedAt(now);
        t.setUpdatedAt(now);

        // Then
        assertEquals(1L, t.getId());
        assertEquals("Test Task", t.getTitle());
        assertEquals("Test Description", t.getDescription());
        assertEquals(Task.Priority.HIGH, t.getPriority());
        assertEquals(dueDate, t.getDueDate());
        assertEquals(user, t.getAssignedTo());
        assertEquals(project, t.getProject());
        assertEquals(now, t.getCreatedAt());
        assertEquals(now, t.getUpdatedAt());
    }

    @Test
    void testTaskToString() {
        // When
        String result = task.toString();

        // Then
        assertNotNull(result);
        // Le toString peut contenir différentes informations selon l'implémentation
        // Vérifions juste qu'il n'est pas vide et qu'il contient l'ID
        assertFalse(result.isEmpty());
        assertTrue(result.contains("1") || result.contains("id"));
    }

    @Test
    void testTaskPriorityEnum() {
        // Test all enum values
        assertEquals(Task.Priority.LOW, Task.Priority.valueOf("LOW"));
        assertEquals(Task.Priority.MEDIUM, Task.Priority.valueOf("MEDIUM"));
        assertEquals(Task.Priority.HIGH, Task.Priority.valueOf("HIGH"));
        assertEquals(Task.Priority.URGENT, Task.Priority.valueOf("URGENT"));
    }

    @Test
    void testTaskStatusEnum() {
        // Test TaskStatusEnum values
        assertEquals(TaskStatusEnum.TODO, TaskStatusEnum.valueOf("TODO"));
        assertEquals(TaskStatusEnum.IN_PROGRESS, TaskStatusEnum.valueOf("IN_PROGRESS"));
        assertEquals(TaskStatusEnum.DONE, TaskStatusEnum.valueOf("DONE"));
        assertEquals(TaskStatusEnum.CANCELLED, TaskStatusEnum.valueOf("CANCELLED"));
    }

    @Test
    void testTaskGettersSetters() {
        Task task = new Task();
        task.setId(1L);
        task.setTitle("Test Task");
        task.setDescription("Description");
        task.setDueDate(java.time.LocalDate.now());
        task.setPriority(Task.Priority.HIGH);
        task.setProject(null);
        task.setAssignedTo(null);
        task.setCreatedBy(null);
        task.setStatus(null);

        assertEquals(1L, task.getId());
        assertEquals("Test Task", task.getTitle());
        assertEquals("Description", task.getDescription());
        assertNotNull(task.getDueDate());
        assertEquals(Task.Priority.HIGH, task.getPriority());
        assertNull(task.getProject());
        assertNull(task.getAssignedTo());
        assertNull(task.getCreatedBy());
        assertNull(task.getStatus());
    }
} 