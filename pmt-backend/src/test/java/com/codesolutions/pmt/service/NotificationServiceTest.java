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
class NotificationServiceTest {

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
        testNotification.setMessage("Test notification");
        testNotification.setUser(testUser);
        testNotification.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void getAllNotifications_Success() {
        // Given
        List<Notification> notifications = Arrays.asList(testNotification);
        when(notificationRepository.findAll()).thenReturn(notifications);

        // When
        List<Notification> result = notificationService.getAllNotifications();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testNotification, result.get(0));
        verify(notificationRepository).findAll();
    }

    @Test
    void getNotificationById_Success() {
        // Given
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(testNotification));

        // When
        Notification result = notificationService.getNotificationById(1L);

        // Then
        assertNotNull(result);
        assertEquals(testNotification, result);
        verify(notificationRepository).findById(1L);
    }

    @Test
    void getNotificationById_NotFound() {
        // Given
        when(notificationRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            notificationService.getNotificationById(999L);
        });
        verify(notificationRepository).findById(999L);
    }

    @Test
    void getNotificationsByUser_Success() {
        // Given
        List<Notification> notifications = Arrays.asList(testNotification);
        when(notificationRepository.findByUserId(1L)).thenReturn(notifications);

        // When
        List<Notification> result = notificationService.getNotificationsByUser(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testNotification, result.get(0));
        verify(notificationRepository).findByUserId(1L);
    }

    @Test
    void createNotification_Success() {
        // Given
        NotificationCreateDTO dto = new NotificationCreateDTO();
        dto.setUserId(1L);
        dto.setMessage("Test message");
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(notificationRepository.save(any(Notification.class))).thenReturn(testNotification);

        // When
        Notification result = notificationService.createNotification(dto);

        // Then
        assertNotNull(result);
        assertEquals(testNotification, result);
        verify(userRepository).findById(1L);
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void deleteNotification_Success() {
        // Given
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(testNotification));

        // When
        notificationService.deleteNotification(1L);

        // Then
        verify(notificationRepository).findById(1L);
        verify(notificationRepository).delete(testNotification);
    }
} 