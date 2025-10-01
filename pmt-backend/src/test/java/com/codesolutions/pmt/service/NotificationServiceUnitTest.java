package com.codesolutions.pmt.service;

import com.codesolutions.pmt.dto.NotificationCreateDTO;
import com.codesolutions.pmt.entity.Notification;
import com.codesolutions.pmt.entity.User;
import com.codesolutions.pmt.repository.NotificationRepository;
import com.codesolutions.pmt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceUnitTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private NotificationService notificationService;

    private User testUser;
    private Notification testNotification;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");

        testNotification = new Notification();
        testNotification.setId(1L);
        testNotification.setUser(testUser);
        testNotification.setTitle("Test Notification");
        testNotification.setMessage("Test message");
        testNotification.setType("INFO");
        testNotification.setIsRead(false);
        testNotification.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void testGetAllNotifications() {
        // Given
        List<Notification> notifications = Arrays.asList(testNotification);
        when(notificationRepository.findAll()).thenReturn(notifications);

        // When
        List<Notification> result = notificationService.getAllNotifications();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Notification", result.get(0).getTitle());
        verify(notificationRepository).findAll();
    }

    @Test
    void testGetNotificationById() {
        // Given
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(testNotification));

        // When
        Notification result = notificationService.getNotificationById(1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Notification", result.getTitle());
        verify(notificationRepository).findById(1L);
    }

    @Test
    void testGetNotificationById_NotFound() {
        // Given
        when(notificationRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            notificationService.getNotificationById(999L);
        });
        verify(notificationRepository).findById(999L);
    }

    @Test
    void testGetNotificationsByUser() {
        // Given
        List<Notification> notifications = Arrays.asList(testNotification);
        when(notificationRepository.findByUserId(1L)).thenReturn(notifications);

        // When
        List<Notification> result = notificationService.getNotificationsByUser(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getUser().getId());
        verify(notificationRepository).findByUserId(1L);
    }

    @Test
    void testGetUnreadNotificationsByUser() {
        // Given
        List<Notification> notifications = Arrays.asList(testNotification);
        when(notificationRepository.findByUserIdAndIsReadFalse(1L)).thenReturn(notifications);

        // When
        List<Notification> result = notificationService.getUnreadNotificationsByUser(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(notificationRepository).findByUserIdAndIsReadFalse(1L);
    }

    @Test
    void testGetNotificationsByProject() {
        // Given
        List<Notification> notifications = Arrays.asList(testNotification);
        when(notificationRepository.findByRelatedEntityTypeAndRelatedEntityId("PROJECT", 1L)).thenReturn(notifications);

        // When
        List<Notification> result = notificationService.getNotificationsByProject(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(notificationRepository).findByRelatedEntityTypeAndRelatedEntityId("PROJECT", 1L);
    }

    @Test
    void testGetNotificationsByTask() {
        // Given
        List<Notification> notifications = Arrays.asList(testNotification);
        when(notificationRepository.findByRelatedEntityTypeAndRelatedEntityId("TASK", 1L)).thenReturn(notifications);

        // When
        List<Notification> result = notificationService.getNotificationsByTask(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(notificationRepository).findByRelatedEntityTypeAndRelatedEntityId("TASK", 1L);
    }

    @Test
    void testCreateNotification() {
        // Given
        NotificationCreateDTO createDTO = new NotificationCreateDTO();
        createDTO.setUserId(1L);
        createDTO.setTitle("New Notification");
        createDTO.setMessage("New message");
        createDTO.setType("INFO");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(notificationRepository.save(any(Notification.class))).thenReturn(testNotification);

        // When
        Notification result = notificationService.createNotification(createDTO);

        // Then
        assertNotNull(result);
        verify(userRepository).findById(1L);
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void testCreateNotification_UserNotFound() {
        // Given
        NotificationCreateDTO createDTO = new NotificationCreateDTO();
        createDTO.setUserId(999L);
        createDTO.setTitle("New Notification");
        createDTO.setMessage("New message");
        createDTO.setType("INFO");

        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            notificationService.createNotification(createDTO);
        });
        verify(userRepository).findById(999L);
    }

    @Test
    void testMarkAsRead() {
        // Given
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(testNotification));
        when(notificationRepository.save(any(Notification.class))).thenReturn(testNotification);

        // When
        Notification result = notificationService.markAsRead(1L);

        // Then
        assertNotNull(result);
        verify(notificationRepository).findById(1L);
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void testMarkAsRead_NotFound() {
        // Given
        when(notificationRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            notificationService.markAsRead(999L);
        });
        verify(notificationRepository).findById(999L);
    }

    @Test
    void testMarkAllAsRead() {
        // Given
        List<Notification> unreadNotifications = Arrays.asList(testNotification);
        when(notificationRepository.findByUserIdAndIsReadFalse(1L)).thenReturn(unreadNotifications);
        when(notificationRepository.saveAll(any())).thenReturn(unreadNotifications);

        // When
        notificationService.markAllAsRead(1L);

        // Then
        verify(notificationRepository).findByUserIdAndIsReadFalse(1L);
        verify(notificationRepository).saveAll(any());
    }

    @Test
    void testDeleteNotification() {
        // Given
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(testNotification));

        // When
        notificationService.deleteNotification(1L);

        // Then
        verify(notificationRepository).findById(1L);
        verify(notificationRepository).delete(testNotification);
    }

    @Test
    void testDeleteAllNotificationsByUser() {
        // Given
        List<Notification> notifications = Arrays.asList(testNotification);
        when(notificationRepository.findByUserId(1L)).thenReturn(notifications);

        // When
        notificationService.deleteAllNotificationsByUser(1L);

        // Then
        verify(notificationRepository).findByUserId(1L);
        verify(notificationRepository).deleteAll(notifications);
    }

    @Test
    void testGetUnreadCount() {
        // Given
        when(notificationRepository.countByUserIdAndIsReadFalse(1L)).thenReturn(5L);

        // When
        long count = notificationService.getUnreadCount(1L);

        // Then
        assertEquals(5L, count);
        verify(notificationRepository).countByUserIdAndIsReadFalse(1L);
    }
}
