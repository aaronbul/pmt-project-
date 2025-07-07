package com.codesolutions.pmt.entity;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class NotificationTest {
    @Test
    void testNotificationGettersSetters() {
        Notification notif = new Notification();
        notif.setId(1L);
        notif.setMessage("Test message");
        notif.setIsRead(true);
        notif.setCreatedAt(LocalDateTime.now());
        notif.setType("INFO");
        notif.setUser(null);

        assertEquals(1L, notif.getId());
        assertEquals("Test message", notif.getMessage());
        assertTrue(notif.getIsRead());
        assertNotNull(notif.getCreatedAt());
        assertEquals("INFO", notif.getType());
        assertNull(notif.getUser());
    }

    @Test
    void testNotificationConstructor() {
        User user = new User();
        user.setId(1L);
        
        Notification notif = new Notification(user, "Test Title", "Test Message", "INFO");
        
        assertEquals(user, notif.getUser());
        assertEquals("Test Title", notif.getTitle());
        assertEquals("Test Message", notif.getMessage());
        assertEquals("INFO", notif.getType());
    }

    @Test
    void testNotificationToString() {
        Notification notif = new Notification();
        notif.setId(1L);
        notif.setTitle("Test Title");
        notif.setType("INFO");
        notif.setIsRead(false);
        
        String result = notif.toString();
        
        assertNotNull(result);
        assertTrue(result.contains("Notification"));
    }
} 