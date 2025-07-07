package com.codesolutions.pmt.dto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class NotificationCreateDTOTest {
    @Test
    void testNotificationCreateDTOGettersSetters() {
        NotificationCreateDTO dto = new NotificationCreateDTO();
        dto.setUserId(1L);
        dto.setTitle("Test Title");
        dto.setMessage("Test Message");
        dto.setType("INFO");
        dto.setProjectId(2L);
        dto.setTaskId(3L);

        assertEquals(1L, dto.getUserId());
        assertEquals("Test Title", dto.getTitle());
        assertEquals("Test Message", dto.getMessage());
        assertEquals("INFO", dto.getType());
        assertEquals(2L, dto.getProjectId());
        assertEquals(3L, dto.getTaskId());
    }

    @Test
    void testNotificationCreateDTOToString() {
        NotificationCreateDTO dto = new NotificationCreateDTO();
        dto.setTitle("Test Title");
        String result = dto.toString();
        assertNotNull(result);
        assertFalse(result.isEmpty());
    }
} 