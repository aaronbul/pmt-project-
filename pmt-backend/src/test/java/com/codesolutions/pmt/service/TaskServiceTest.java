package com.codesolutions.pmt.service;

import com.codesolutions.pmt.dto.TaskCreateDTO;
import com.codesolutions.pmt.dto.TaskUpdateDTO;
import com.codesolutions.pmt.entity.*;
import com.codesolutions.pmt.repository.ProjectRepository;
import com.codesolutions.pmt.repository.TaskRepository;
import com.codesolutions.pmt.repository.TaskStatusRepository;
import com.codesolutions.pmt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private TaskStatusRepository taskStatusRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskService taskService;

    private Task testTask;
    private TaskCreateDTO testTaskCreateDto;
    private TaskUpdateDTO testTaskUpdateDto;
    private Project testProject;
    private User testUser;
    private TaskStatus testTaskStatus;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");

        testProject = new Project();
        testProject.setId(1L);
        testProject.setName("Test Project");
        testProject.setDescription("Test Description");
        testProject.setStartDate(LocalDate.now());
        testProject.setCreatedBy(testUser);

        testTaskStatus = new TaskStatus();
        testTaskStatus.setId(1);
        testTaskStatus.setName("TODO");

        testTask = new Task();
        testTask.setId(1L);
        testTask.setTitle("Test Task");
        testTask.setDescription("Test Description");
        testTask.setStatus(testTaskStatus);
        testTask.setPriority(Task.Priority.MEDIUM);
        testTask.setProject(testProject);
        testTask.setAssignedTo(testUser);
        testTask.setCreatedBy(testUser);
        testTask.setCreatedAt(LocalDateTime.now());
        testTask.setUpdatedAt(LocalDateTime.now());

        testTaskCreateDto = new TaskCreateDTO();
        testTaskCreateDto.setTitle("Test Task");
        testTaskCreateDto.setDescription("Test Description");
        testTaskCreateDto.setProjectId(1L);
        testTaskCreateDto.setAssignedToId(1L);
        testTaskCreateDto.setCreatedById(1L);

        testTaskUpdateDto = new TaskUpdateDTO();
        testTaskUpdateDto.setTitle("Updated Task");
        testTaskUpdateDto.setDescription("Updated Description");
        testTaskUpdateDto.setStatus("IN_PROGRESS");
        testTaskUpdateDto.setPriority(TaskPriority.HIGH);
    }

    @Test
    void createTask_Success() {
        // Given
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(taskStatusRepository.findByName("TODO")).thenReturn(Optional.of(testTaskStatus));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // When
        Task result = taskService.createTask(testTaskCreateDto);

        // Then
        assertNotNull(result);
        assertEquals(testTask.getTitle(), result.getTitle());
        assertEquals(testTask.getDescription(), result.getDescription());
        verify(projectRepository).findById(1L);
        verify(userRepository, times(2)).findById(1L);
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void createTask_ProjectNotFound_ThrowsException() {
        // Given
        when(projectRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            taskService.createTask(testTaskCreateDto);
        });
        assertEquals("Projet non trouvé avec l'ID: 1", exception.getMessage());
        verify(projectRepository).findById(1L);
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void createTask_UserNotFound_ThrowsException() {
        // Given
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            taskService.createTask(testTaskCreateDto);
        });
        assertEquals("Utilisateur non trouvé avec l'ID: 1", exception.getMessage());
        verify(projectRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void getTaskById_Success() {
        // Given
        when(taskRepository.findByIdWithRelations(1L)).thenReturn(testTask);

        // When
        Task result = taskService.getTaskById(1L);

        // Then
        assertNotNull(result);
        assertEquals(testTask.getTitle(), result.getTitle());
        assertEquals(testTask.getDescription(), result.getDescription());
        verify(taskRepository).findByIdWithRelations(1L);
    }

    @Test
    void getTaskById_TaskNotFound_ThrowsException() {
        // Given
        when(taskRepository.findByIdWithRelations(1L)).thenReturn(null);

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            taskService.getTaskById(1L);
        });
        assertEquals("Tâche non trouvée avec l'ID: 1", exception.getMessage());
        verify(taskRepository).findByIdWithRelations(1L);
    }

    @Test
    void getAllTasks_Success() {
        // Given
        Task task2 = new Task();
        task2.setId(2L);
        task2.setTitle("Task 2");
        task2.setDescription("Description 2");
        task2.setStatus(testTaskStatus);
        task2.setPriority(Task.Priority.HIGH);
        task2.setProject(testProject);
        task2.setAssignedTo(testUser);
        
        when(taskRepository.findAllWithRelations()).thenReturn(Arrays.asList(testTask, task2));

        // When
        List<Task> result = taskService.getAllTasks();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(testTask.getTitle(), result.get(0).getTitle());
        assertEquals(task2.getTitle(), result.get(1).getTitle());
        verify(taskRepository).findAllWithRelations();
    }

    @Test
    void updateTask_Success() {
        // Given
        TaskStatus inProgressStatus = new TaskStatus();
        inProgressStatus.setId(2);
        inProgressStatus.setName("IN_PROGRESS");
        
        when(taskRepository.findByIdWithRelations(1L)).thenReturn(testTask);
        when(taskStatusRepository.findByName("IN_PROGRESS")).thenReturn(Optional.of(inProgressStatus));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // When
        Task result = taskService.updateTask(1L, testTaskUpdateDto);

        // Then
        assertNotNull(result);
        assertEquals(testTask.getTitle(), result.getTitle());
        verify(taskRepository).findByIdWithRelations(1L);
        verify(taskStatusRepository).findByName("IN_PROGRESS");
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void updateTask_TaskNotFound_ThrowsException() {
        // Given
        when(taskRepository.findByIdWithRelations(1L)).thenReturn(null);

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            taskService.updateTask(1L, testTaskUpdateDto);
        });
        assertEquals("Tâche non trouvée avec l'ID: 1", exception.getMessage());
        verify(taskRepository).findByIdWithRelations(1L);
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void deleteTask_Success() {
        // Given
        when(taskRepository.findByIdWithRelations(1L)).thenReturn(testTask);

        // When
        taskService.deleteTask(1L);

        // Then
        verify(taskRepository).findByIdWithRelations(1L);
        verify(taskRepository).delete(testTask);
    }

    @Test
    void getTasksByProject_Success() {
        // Given
        Task task2 = new Task();
        task2.setId(2L);
        task2.setTitle("Task 2");
        task2.setProject(testProject);
        
        when(taskRepository.findByProjectIdWithRelations(1L)).thenReturn(Arrays.asList(testTask, task2));

        // When
        List<Task> result = taskService.getTasksByProject(1L);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(testTask.getTitle(), result.get(0).getTitle());
        assertEquals(task2.getTitle(), result.get(1).getTitle());
        verify(taskRepository).findByProjectIdWithRelations(1L);
    }

    @Test
    void getTasksAssignedToUser_Success() {
        // Given
        Task task2 = new Task();
        task2.setId(2L);
        task2.setTitle("Task 2");
        task2.setAssignedTo(testUser);
        
        when(taskRepository.findByAssignedToId(1L)).thenReturn(Arrays.asList(testTask, task2));

        // When
        List<Task> result = taskService.getTasksAssignedToUser(1L);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(testTask.getTitle(), result.get(0).getTitle());
        assertEquals(task2.getTitle(), result.get(1).getTitle());
        verify(taskRepository).findByAssignedToId(1L);
    }
} 