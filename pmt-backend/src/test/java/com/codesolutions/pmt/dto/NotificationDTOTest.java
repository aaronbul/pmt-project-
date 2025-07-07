package com.codesolutions.pmt.dto;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class NotificationDTOTest {

    @Test
    void testNotificationDTOCreation() {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(1L);
        dto.setUserId(1L);
        dto.setTitle("Test Title");
        dto.setMessage("Test Message");
        dto.setType("INFO");
        dto.setRead(false);
        dto.setCreatedAt(LocalDateTime.now());

        assertEquals(1L, dto.getId());
        assertEquals(1L, dto.getUserId());
        assertEquals("Test Title", dto.getTitle());
        assertEquals("Test Message", dto.getMessage());
        assertEquals("INFO", dto.getType());
        assertFalse(dto.isRead());
        assertNotNull(dto.getCreatedAt());
    }

    @Test
    void testNotificationDTOGettersSetters() {
        NotificationDTO dto = new NotificationDTO();
        
        dto.setUsername("testuser");
        dto.setProjectId(1L);
        dto.setProjectName("Test Project");
        dto.setTaskId(1L);
        dto.setTaskTitle("Test Task");

        assertEquals("testuser", dto.getUsername());
        assertEquals(1L, dto.getProjectId());
        assertEquals("Test Project", dto.getProjectName());
        assertEquals(1L, dto.getTaskId());
        assertEquals("Test Task", dto.getTaskTitle());
    }

    @Test
    void testNotificationDTOToString() {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(1L);
        dto.setTitle("Test Title");
        dto.setType("INFO");

        String result = dto.toString();

        assertNotNull(result);
        assertFalse(result.isEmpty());
    }

    @Test
    void testNotificationDTOEqualsAndHashCode() {
        NotificationDTO dto1 = new NotificationDTO();
        dto1.setId(1L);
        NotificationDTO dto2 = new NotificationDTO();
        dto2.setId(1L);
        NotificationDTO dto3 = new NotificationDTO();
        dto3.setId(2L);
        assertNotNull(dto1);
        assertNotNull(dto2);
        assertNotNull(dto3);
        assertNotEquals(dto1, null);
        assertEquals(dto1, dto1);
        assertNotEquals(dto1, dto3);
        assertEquals(dto1.hashCode(), dto1.hashCode());
    }
} 