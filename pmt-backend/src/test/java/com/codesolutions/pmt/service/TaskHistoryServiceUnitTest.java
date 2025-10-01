package com.codesolutions.pmt.service;

import com.codesolutions.pmt.entity.Task;
import com.codesolutions.pmt.entity.TaskHistory;
import com.codesolutions.pmt.entity.User;
import com.codesolutions.pmt.repository.TaskHistoryRepository;
import com.codesolutions.pmt.repository.TaskRepository;
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
class TaskHistoryServiceUnitTest {

    @Mock
    private TaskHistoryRepository taskHistoryRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskHistoryService taskHistoryService;

    private User testUser;
    private Task testTask;
    private TaskHistory testTaskHistory;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        testTask = new Task();
        testTask.setId(1L);
        testTask.setTitle("Test Task");

        testTaskHistory = new TaskHistory();
        testTaskHistory.setId(1L);
        testTaskHistory.setTask(testTask);
        testTaskHistory.setUser(testUser);
        testTaskHistory.setAction("CREATED");
        testTaskHistory.setOldValue(null);
        testTaskHistory.setNewValue("Task created");
        testTaskHistory.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void testGetAllTaskHistory() {
        // Given
        List<TaskHistory> history = Arrays.asList(testTaskHistory);
        when(taskHistoryRepository.findAll()).thenReturn(history);

        // When
        List<TaskHistory> result = taskHistoryService.getAllTaskHistory();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getId());
        verify(taskHistoryRepository).findAll();
    }

    @Test
    void testGetTaskHistoryById() {
        // Given
        when(taskHistoryRepository.findById(1L)).thenReturn(Optional.of(testTaskHistory));

        // When
        TaskHistory result = taskHistoryService.getTaskHistoryById(1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("CREATED", result.getAction());
        verify(taskHistoryRepository).findById(1L);
    }

    @Test
    void testGetTaskHistoryById_NotFound() {
        // Given
        when(taskHistoryRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            taskHistoryService.getTaskHistoryById(999L);
        });
        verify(taskHistoryRepository).findById(999L);
    }

    @Test
    void testGetTaskHistoryByTask() {
        // Given
        List<TaskHistory> history = Arrays.asList(testTaskHistory);
        when(taskHistoryRepository.findByTaskId(1L)).thenReturn(history);

        // When
        List<TaskHistory> result = taskHistoryService.getTaskHistoryByTask(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getTask().getId());
        verify(taskHistoryRepository).findByTaskId(1L);
    }

    @Test
    void testGetTaskHistoryByProject() {
        // Given
        List<TaskHistory> history = Arrays.asList(testTaskHistory);
        when(taskHistoryRepository.findByProjectId(1L)).thenReturn(history);

        // When
        List<TaskHistory> result = taskHistoryService.getTaskHistoryByProject(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(taskHistoryRepository).findByProjectId(1L);
    }

    @Test
    void testGetTaskHistoryByUser() {
        // Given
        List<TaskHistory> history = Arrays.asList(testTaskHistory);
        when(taskHistoryRepository.findByUserId(1L)).thenReturn(history);

        // When
        List<TaskHistory> result = taskHistoryService.getTaskHistoryByUser(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getUser().getId());
        verify(taskHistoryRepository).findByUserId(1L);
    }

    @Test
    void testGetTaskHistoryByAction() {
        // Given
        List<TaskHistory> history = Arrays.asList(testTaskHistory);
        when(taskHistoryRepository.findByAction("CREATED")).thenReturn(history);

        // When
        List<TaskHistory> result = taskHistoryService.getTaskHistoryByAction("CREATED");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("CREATED", result.get(0).getAction());
        verify(taskHistoryRepository).findByAction("CREATED");
    }

    @Test
    void testGetRecentTaskHistory() {
        // Given
        List<TaskHistory> history = Arrays.asList(testTaskHistory);
        when(taskHistoryRepository.findRecentByTaskId(1L)).thenReturn(history);

        // When
        List<TaskHistory> result = taskHistoryService.getRecentTaskHistory(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(taskHistoryRepository).findRecentByTaskId(1L);
    }

    @Test
    void testCreateTaskHistory() {
        // Given
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(taskHistoryRepository.save(any(TaskHistory.class))).thenReturn(testTaskHistory);

        // When
        TaskHistory result = taskHistoryService.createTaskHistory("TEST_ACTION", "old_value", "new_value", 1L, 1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(taskRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(taskHistoryRepository).save(any(TaskHistory.class));
    }

    @Test
    void testCreateTaskHistory_TaskNotFound() {
        // Given
        when(taskRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            taskHistoryService.createTaskHistory("TEST_ACTION", "old_value", "new_value", 999L, 1L);
        });
        verify(taskRepository).findById(999L);
    }

    @Test
    void testCreateTaskHistory_UserNotFound() {
        // Given
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            taskHistoryService.createTaskHistory("TEST_ACTION", "old_value", "new_value", 1L, 999L);
        });
        verify(taskRepository).findById(1L);
        verify(userRepository).findById(999L);
    }

    @Test
    void testDeleteTaskHistory() {
        // Given
        when(taskHistoryRepository.findById(1L)).thenReturn(Optional.of(testTaskHistory));

        // When
        taskHistoryService.deleteTaskHistory(1L);

        // Then
        verify(taskHistoryRepository).findById(1L);
        verify(taskHistoryRepository).delete(testTaskHistory);
    }

    @Test
    void testDeleteTaskHistoryByTask() {
        // Given
        List<TaskHistory> history = Arrays.asList(testTaskHistory);
        when(taskHistoryRepository.findByTaskId(1L)).thenReturn(history);

        // When
        taskHistoryService.deleteTaskHistoryByTask(1L);

        // Then
        verify(taskHistoryRepository).findByTaskId(1L);
        verify(taskHistoryRepository).deleteAll(history);
    }

    @Test
    void testCreateTaskCreatedHistory() {
        // Given
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(taskHistoryRepository.save(any(TaskHistory.class))).thenReturn(testTaskHistory);

        // When
        TaskHistory result = taskHistoryService.createTaskCreatedHistory(1L, 1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(taskRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(taskHistoryRepository).save(any(TaskHistory.class));
    }

    @Test
    void testCreateStatusChangedHistory() {
        // Given
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(taskHistoryRepository.save(any(TaskHistory.class))).thenReturn(testTaskHistory);

        // When
        TaskHistory result = taskHistoryService.createStatusChangedHistory(1L, 1L, "TODO", "IN_PROGRESS");

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(taskRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(taskHistoryRepository).save(any(TaskHistory.class));
    }

    @Test
    void testCreateTaskAssignedHistory() {
        // Given
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(taskHistoryRepository.save(any(TaskHistory.class))).thenReturn(testTaskHistory);

        // When
        TaskHistory result = taskHistoryService.createTaskAssignedHistory(1L, 1L, "user1", "user2");

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(taskRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(taskHistoryRepository).save(any(TaskHistory.class));
    }

    @Test
    void testCreatePriorityChangedHistory() {
        // Given
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(taskHistoryRepository.save(any(TaskHistory.class))).thenReturn(testTaskHistory);

        // When
        TaskHistory result = taskHistoryService.createPriorityChangedHistory(1L, 1L, "LOW", "HIGH");

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(taskRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(taskHistoryRepository).save(any(TaskHistory.class));
    }

    @Test
    void testCreateDescriptionChangedHistory() {
        // Given
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(taskHistoryRepository.save(any(TaskHistory.class))).thenReturn(testTaskHistory);

        // When
        TaskHistory result = taskHistoryService.createDescriptionChangedHistory(1L, 1L, "Old description", "New description");

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(taskRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(taskHistoryRepository).save(any(TaskHistory.class));
    }

    @Test
    void testCreateTaskDeletedHistory() {
        // Given
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(taskHistoryRepository.save(any(TaskHistory.class))).thenReturn(testTaskHistory);

        // When
        TaskHistory result = taskHistoryService.createTaskDeletedHistory(1L, 1L, "Task Title");

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(taskRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(taskHistoryRepository).save(any(TaskHistory.class));
    }
}
