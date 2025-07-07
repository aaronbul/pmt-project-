package com.codesolutions.pmt.service;

import com.codesolutions.pmt.entity.Task;
import com.codesolutions.pmt.entity.TaskHistory;
import com.codesolutions.pmt.entity.User;
import com.codesolutions.pmt.repository.TaskHistoryRepository;
import com.codesolutions.pmt.repository.TaskRepository;
import com.codesolutions.pmt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TaskHistoryServiceTest {

    @Mock
    private TaskHistoryRepository taskHistoryRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskHistoryService taskHistoryService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllTaskHistory() {
        // Given
        TaskHistory history1 = new TaskHistory();
        history1.setId(1L);
        TaskHistory history2 = new TaskHistory();
        history2.setId(2L);
        List<TaskHistory> histories = Arrays.asList(history1, history2);

        when(taskHistoryRepository.findAll()).thenReturn(histories);

        // When
        List<TaskHistory> result = taskHistoryService.getAllTaskHistory();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(taskHistoryRepository).findAll();
    }

    @Test
    void testGetTaskHistoryById() {
        // Given
        Long historyId = 1L;
        TaskHistory history = new TaskHistory();
        history.setId(historyId);

        when(taskHistoryRepository.findById(historyId)).thenReturn(Optional.of(history));

        // When
        TaskHistory result = taskHistoryService.getTaskHistoryById(historyId);

        // Then
        assertNotNull(result);
        assertEquals(historyId, result.getId());
        verify(taskHistoryRepository).findById(historyId);
    }

    @Test
    void testGetTaskHistoryByTask() {
        // Given
        Long taskId = 1L;
        TaskHistory history = new TaskHistory();
        history.setId(1L);
        List<TaskHistory> histories = Arrays.asList(history);

        when(taskHistoryRepository.findByTaskId(taskId)).thenReturn(histories);

        // When
        List<TaskHistory> result = taskHistoryService.getTaskHistoryByTask(taskId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(taskHistoryRepository).findByTaskId(taskId);
    }

    @Test
    void testCreateTaskHistory() {
        // Given
        Long taskId = 1L;
        Long userId = 1L;
        String action = "TASK_CREATED";
        String oldValue = null;
        String newValue = "Nouvelle tâche créée";

        Task task = new Task();
        task.setId(taskId);
        User user = new User();
        user.setId(userId);

        TaskHistory history = new TaskHistory();
        history.setId(1L);
        history.setTask(task);
        history.setUser(user);
        history.setAction(action);

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(taskHistoryRepository.save(any(TaskHistory.class))).thenReturn(history);

        // When
        TaskHistory result = taskHistoryService.createTaskHistory(action, oldValue, newValue, taskId, userId);

        // Then
        assertNotNull(result);
        assertEquals(action, result.getAction());
        verify(taskRepository).findById(taskId);
        verify(userRepository).findById(userId);
        verify(taskHistoryRepository).save(any(TaskHistory.class));
    }

    @Test
    void testCreateTaskCreatedHistory() {
        // Given
        Long taskId = 1L;
        Long userId = 1L;

        Task task = new Task();
        task.setId(taskId);
        User user = new User();
        user.setId(userId);

        TaskHistory history = new TaskHistory();
        history.setId(1L);
        history.setAction("CREATED");

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(taskHistoryRepository.save(any(TaskHistory.class))).thenReturn(history);

        // When
        TaskHistory result = taskHistoryService.createTaskCreatedHistory(taskId, userId);

        // Then
        assertNotNull(result);
        assertEquals("CREATED", result.getAction());
        verify(taskRepository).findById(taskId);
        verify(userRepository).findById(userId);
        verify(taskHistoryRepository).save(any(TaskHistory.class));
    }

    @Test
    void testDeleteTaskHistory() {
        // Given
        Long historyId = 1L;
        TaskHistory history = new TaskHistory();
        history.setId(historyId);

        when(taskHistoryRepository.findById(historyId)).thenReturn(Optional.of(history));
        doNothing().when(taskHistoryRepository).delete(history);

        // When
        taskHistoryService.deleteTaskHistory(historyId);

        // Then
        verify(taskHistoryRepository).findById(historyId);
        verify(taskHistoryRepository).delete(history);
    }
} 