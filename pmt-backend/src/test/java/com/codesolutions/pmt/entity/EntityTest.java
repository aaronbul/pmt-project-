package com.codesolutions.pmt.entity;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class EntityTest {

    @Test
    void testUserEntity() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("password123");
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        assertEquals(1L, user.getId());
        assertEquals("testuser", user.getUsername());
        assertEquals("test@example.com", user.getEmail());
        assertEquals("password123", user.getPassword());
        assertNotNull(user.getCreatedAt());
        assertNotNull(user.getUpdatedAt());
    }

    @Test
    void testProjectEntity() {
        Project project = new Project();
        project.setId(1L);
        project.setName("Test Project");
        project.setDescription("Test Description");
        project.setStartDate(LocalDate.now());
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());

        assertEquals(1L, project.getId());
        assertEquals("Test Project", project.getName());
        assertEquals("Test Description", project.getDescription());
        assertNotNull(project.getStartDate());
        assertNotNull(project.getCreatedAt());
        assertNotNull(project.getUpdatedAt());
    }

    @Test
    void testTaskEntity() {
        Task task = new Task();
        task.setId(1L);
        task.setTitle("Test Task");
        task.setDescription("Test Description");
        task.setPriority(Task.Priority.HIGH);
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        assertEquals(1L, task.getId());
        assertEquals("Test Task", task.getTitle());
        assertEquals("Test Description", task.getDescription());
        assertEquals(Task.Priority.HIGH, task.getPriority());
        assertNotNull(task.getCreatedAt());
        assertNotNull(task.getUpdatedAt());
    }

    @Test
    void testRoleEntity() {
        Role role = new Role();
        role.setId(1);
        role.setName("ADMIN");

        assertEquals(1, role.getId());
        assertEquals("ADMIN", role.getName());
    }

    @Test
    void testTaskStatusEntity() {
        TaskStatus status = new TaskStatus();
        status.setId(1);
        status.setName("TODO");

        assertEquals(1, status.getId());
        assertEquals("TODO", status.getName());
    }

    @Test
    void testNotificationEntity() {
        Notification notification = new Notification();
        notification.setId(1L);
        notification.setMessage("Test notification");
        notification.setCreatedAt(LocalDateTime.now());

        assertEquals(1L, notification.getId());
        assertEquals("Test notification", notification.getMessage());
        assertNotNull(notification.getCreatedAt());
    }

    @Test
    void testProjectMemberEntity() {
        ProjectMember member = new ProjectMember();
        member.setId(1L);
        member.setJoinedAt(LocalDateTime.now());

        assertEquals(1L, member.getId());
        assertNotNull(member.getJoinedAt());
    }

    @Test
    void testTaskHistoryEntity() {
        TaskHistory history = new TaskHistory();
        history.setId(1L);
        history.setAction("CREATED");
        history.setOldValue("old");
        history.setNewValue("new");
        history.setCreatedAt(LocalDateTime.now());

        assertEquals(1L, history.getId());
        assertEquals("CREATED", history.getAction());
        assertEquals("old", history.getOldValue());
        assertEquals("new", history.getNewValue());
        assertNotNull(history.getCreatedAt());
    }

    @Test
    void testTaskPriorityEnum() {
        assertEquals("LOW", Task.Priority.LOW.name());
        assertEquals("MEDIUM", Task.Priority.MEDIUM.name());
        assertEquals("HIGH", Task.Priority.HIGH.name());
    }

    @Test
    void testTaskStatusEnum() {
        assertEquals("TODO", TaskStatusEnum.TODO.name());
        assertEquals("IN_PROGRESS", TaskStatusEnum.IN_PROGRESS.name());
        assertEquals("DONE", TaskStatusEnum.DONE.name());
        assertEquals("CANCELLED", TaskStatusEnum.CANCELLED.name());
    }

    @Test
    void testTaskPriorityEnumValues() {
        Task.Priority[] priorities = Task.Priority.values();
        assertEquals(4, priorities.length);
        assertTrue(contains(priorities, Task.Priority.LOW));
        assertTrue(contains(priorities, Task.Priority.MEDIUM));
        assertTrue(contains(priorities, Task.Priority.HIGH));
    }

    @Test
    void testTaskStatusEnumValues() {
        TaskStatusEnum[] statuses = TaskStatusEnum.values();
        assertEquals(5, statuses.length);
        assertTrue(contains(statuses, TaskStatusEnum.TODO));
        assertTrue(contains(statuses, TaskStatusEnum.IN_PROGRESS));
        assertTrue(contains(statuses, TaskStatusEnum.DONE));
        assertTrue(contains(statuses, TaskStatusEnum.CANCELLED));
    }

    private <T> boolean contains(T[] array, T value) {
        for (T item : array) {
            if (item.equals(value)) {
                return true;
            }
        }
        return false;
    }
} 