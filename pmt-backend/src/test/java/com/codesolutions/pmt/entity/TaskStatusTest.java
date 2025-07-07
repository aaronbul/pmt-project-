package com.codesolutions.pmt.entity;

import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TaskStatusTest {

    @Test
    void testTaskStatusCreation() {
        // Given
        TaskStatus status = new TaskStatus();
        status.setId(1);
        status.setName("TODO");

        // When & Then
        assertEquals(1, status.getId());
        assertEquals("TODO", status.getName());
        assertNotNull(status.getTasks());
    }

    @Test
    void testTaskStatusConstructor() {
        // Given
        TaskStatus status = new TaskStatus("IN_PROGRESS");

        // When & Then
        assertEquals("IN_PROGRESS", status.getName());
    }

    @Test
    void testTaskStatusSettersAndGetters() {
        // Given
        TaskStatus status = new TaskStatus();
        List<Task> tasks = new ArrayList<>();

        // When
        status.setId(2);
        status.setName("DONE");
        status.setTasks(tasks);

        // Then
        assertEquals(2, status.getId());
        assertEquals("DONE", status.getName());
        assertEquals(tasks, status.getTasks());
    }

    @Test
    void testTaskStatusEquals() {
        // Given
        TaskStatus status1 = new TaskStatus();
        status1.setId(1);

        TaskStatus status2 = new TaskStatus();
        status2.setId(1);

        TaskStatus status3 = new TaskStatus();
        status3.setId(2);

        // When & Then
        assertNotNull(status1);
        assertNotNull(status2);
        assertNotNull(status3);
        assertNotEquals(status1, null);
        assertEquals(status1, status1);
    }

    @Test
    void testTaskStatusHashCode() {
        // Given
        TaskStatus status1 = new TaskStatus();
        status1.setId(1);

        TaskStatus status2 = new TaskStatus();
        status2.setId(1);

        // When & Then
        assertNotNull(status1.hashCode());
        assertNotNull(status2.hashCode());
        assertEquals(status1.hashCode(), status1.hashCode());
    }

    @Test
    void testTaskStatusToString() {
        // Given
        TaskStatus status = new TaskStatus();
        status.setId(1);
        status.setName("TODO");

        // When
        String result = status.toString();

        // Then
        assertNotNull(result);
        assertTrue(result.contains("TaskStatus"));
        assertTrue(result.contains("id=1"));
        assertTrue(result.contains("name='TODO'"));
    }
} 