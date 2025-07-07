package com.codesolutions.pmt.dto;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class TaskHistoryDTOTest {
    @Test
    void testTaskHistoryDTOGettersSetters() {
        TaskHistoryDTO dto = new TaskHistoryDTO();
        dto.setId(1L);
        dto.setTaskId(1L);
        dto.setUserId(1L);
        dto.setAction("STATUS_CHANGE");
        dto.setOldValue("TODO");
        dto.setNewValue("IN_PROGRESS");
        dto.setTimestamp(LocalDateTime.now());
        dto.setTaskTitle("Titre tâche");
        dto.setUsername("user");
        dto.setProjectId(2L);
        dto.setProjectName("Projet");

        assertEquals(1L, dto.getId());
        assertEquals(1L, dto.getTaskId());
        assertEquals(1L, dto.getUserId());
        assertEquals("STATUS_CHANGE", dto.getAction());
        assertEquals("TODO", dto.getOldValue());
        assertEquals("IN_PROGRESS", dto.getNewValue());
        assertNotNull(dto.getTimestamp());
        assertEquals("Titre tâche", dto.getTaskTitle());
        assertEquals("user", dto.getUsername());
        assertEquals(2L, dto.getProjectId());
        assertEquals("Projet", dto.getProjectName());
    }

    @Test
    void testTaskHistoryDTOToString() {
        TaskHistoryDTO dto = new TaskHistoryDTO();
        dto.setId(1L);
        dto.setAction("STATUS_CHANGE");
        String result = dto.toString();
        assertNotNull(result);
        assertFalse(result.isEmpty());
    }
} 