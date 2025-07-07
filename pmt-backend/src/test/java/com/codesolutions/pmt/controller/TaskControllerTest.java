package com.codesolutions.pmt.controller;

import com.codesolutions.pmt.config.TestSecurityConfig;
import com.codesolutions.pmt.dto.TaskCreateDTO;
import com.codesolutions.pmt.dto.TaskUpdateDTO;
import com.codesolutions.pmt.entity.Task;
import com.codesolutions.pmt.entity.TaskPriority;
import com.codesolutions.pmt.entity.TaskStatusEnum;
import com.codesolutions.pmt.service.TaskService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
@Import(TestSecurityConfig.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskService taskService;

    @Autowired
    private ObjectMapper objectMapper;

    private Task testTask;
    private TaskCreateDTO testTaskCreateDto;
    private TaskUpdateDTO testTaskUpdateDto;

    @BeforeEach
    void setUp() {
        testTask = new Task();
        testTask.setId(1L);
        testTask.setTitle("Test Task");
        testTask.setDescription("Test Description");
        testTask.setPriority(Task.Priority.MEDIUM);
        testTask.setCreatedAt(LocalDateTime.now());
        testTask.setUpdatedAt(LocalDateTime.now());

        testTaskCreateDto = new TaskCreateDTO();
        testTaskCreateDto.setTitle("Test Task");
        testTaskCreateDto.setDescription("Test Description");
        testTaskCreateDto.setPriority(TaskPriority.MEDIUM);
        testTaskCreateDto.setStatus(TaskStatusEnum.TODO);
        testTaskCreateDto.setProjectId(1L);
        testTaskCreateDto.setAssignedToId(1L);
        testTaskCreateDto.setCreatedById(1L);

        testTaskUpdateDto = new TaskUpdateDTO();
        testTaskUpdateDto.setTitle("Updated Task");
        testTaskUpdateDto.setDescription("Updated Description");
        testTaskUpdateDto.setPriority(TaskPriority.HIGH);
        testTaskUpdateDto.setStatus("IN_PROGRESS");
    }

    @Test
    void createTask_Success() throws Exception {
        // Given
        when(taskService.createTask(any(TaskCreateDTO.class))).thenReturn(testTask);

        // When & Then
        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testTaskCreateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Task"));

        verify(taskService).createTask(any(TaskCreateDTO.class));
    }

    @Test
    void getTaskById_Success() throws Exception {
        // Given
        when(taskService.getTaskById(1L)).thenReturn(testTask);

        // When & Then
        mockMvc.perform(get("/api/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Task"));

        verify(taskService).getTaskById(1L);
    }

    @Test
    void getTaskById_NotFound() throws Exception {
        // Given
        when(taskService.getTaskById(999L))
                .thenThrow(new RuntimeException("Tâche non trouvée avec l'ID: 999"));

        // When & Then
        mockMvc.perform(get("/api/tasks/999"))
                .andExpect(status().isNotFound());

        verify(taskService).getTaskById(999L);
    }

    @Test
    void getAllTasks_Success() throws Exception {
        // Given
        Task task2 = new Task();
        task2.setId(2L);
        task2.setTitle("Task 2");

        List<Task> tasks = Arrays.asList(testTask, task2);
        when(taskService.getAllTasks()).thenReturn(tasks);

        // When & Then
        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].title").value("Test Task"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].title").value("Task 2"));

        verify(taskService).getAllTasks();
    }

    @Test
    void updateTask_Success() throws Exception {
        // Given
        when(taskService.updateTask(eq(1L), any(TaskUpdateDTO.class))).thenReturn(testTask);

        // When & Then
        mockMvc.perform(put("/api/tasks/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testTaskUpdateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Task"));

        verify(taskService).updateTask(eq(1L), any(TaskUpdateDTO.class));
    }

    @Test
    void deleteTask_Success() throws Exception {
        // Given
        doNothing().when(taskService).deleteTask(1L);

        // When & Then
        mockMvc.perform(delete("/api/tasks/1"))
                .andExpect(status().isNoContent());

        verify(taskService).deleteTask(1L);
    }

    @Test
    void getTasksByProject_Success() throws Exception {
        // Given
        Task task2 = new Task();
        task2.setId(2L);
        task2.setTitle("Task 2");

        List<Task> tasks = Arrays.asList(testTask, task2);
        when(taskService.getTasksByProject(1L)).thenReturn(tasks);

        // When & Then
        mockMvc.perform(get("/api/tasks/project/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));

        verify(taskService).getTasksByProject(1L);
    }

    @Test
    void getTasksAssignedToUser_Success() throws Exception {
        // Given
        Task task2 = new Task();
        task2.setId(2L);
        task2.setTitle("Task 2");

        List<Task> tasks = Arrays.asList(testTask, task2);
        when(taskService.getTasksAssignedToUser(1L)).thenReturn(tasks);

        // When & Then
        mockMvc.perform(get("/api/tasks/assigned/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));

        verify(taskService).getTasksAssignedToUser(1L);
    }

    @Test
    void assignTask_Success() throws Exception {
        // Given
        when(taskService.assignTask(anyLong(), anyLong())).thenReturn(testTask);

        // When & Then
        mockMvc.perform(put("/api/tasks/1/assign/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(taskService).assignTask(1L, 2L);
    }
} 