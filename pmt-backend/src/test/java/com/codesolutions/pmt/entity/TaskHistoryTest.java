package com.codesolutions.pmt.entity;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class TaskHistoryTest {
    @Test
    void testTaskHistoryGettersSetters() {
        TaskHistory history = new TaskHistory();
        history.setId(1L);
        history.setTask(null);
        history.setAction("STATUS_CHANGE");
        history.setOldValue("TODO");
        history.setNewValue("IN_PROGRESS");
        history.setCreatedAt(LocalDateTime.now());
        history.setUser(null);

        assertEquals(1L, history.getId());
        assertNull(history.getTask());
        assertEquals("STATUS_CHANGE", history.getAction());
        assertEquals("TODO", history.getOldValue());
        assertEquals("IN_PROGRESS", history.getNewValue());
        assertNotNull(history.getCreatedAt());
        assertNull(history.getUser());
    }

    @Test
    void testTaskHistoryConstructor() {
        Task task = new Task();
        task.setId(1L);
        
        User user = new User();
        user.setId(1L);
        
        TaskHistory history = new TaskHistory(task, user, "STATUS_CHANGE", "TODO", "IN_PROGRESS");
        
        assertEquals(task, history.getTask());
        assertEquals(user, history.getUser());
        assertEquals("STATUS_CHANGE", history.getAction());
        assertEquals("TODO", history.getOldValue());
        assertEquals("IN_PROGRESS", history.getNewValue());
    }

    @Test
    void testTaskHistoryToString() {
        TaskHistory history = new TaskHistory();
        history.setId(1L);
        history.setAction("STATUS_CHANGE");
        history.setOldValue("TODO");
        history.setNewValue("IN_PROGRESS");
        
        String result = history.toString();
        
        assertNotNull(result);
        assertTrue(result.contains("TaskHistory"));
    }
} 