package com.codesolutions.pmt.dto;

import com.codesolutions.pmt.entity.TaskPriority;
import com.codesolutions.pmt.entity.TaskStatusEnum;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class TaskDTOTest {

    private TaskDTO taskDTO1;
    private TaskDTO taskDTO2;

    @BeforeEach
    void setUp() {
        LocalDateTime now = LocalDateTime.now();
        
        taskDTO1 = new TaskDTO();
        taskDTO1.setId(1L);
        taskDTO1.setTitle("Test Task 1");
        taskDTO1.setDescription("Test Description 1");
        taskDTO1.setPriority(TaskPriority.HIGH);
        taskDTO1.setStatus(TaskStatusEnum.IN_PROGRESS);
        taskDTO1.setDueDate(now);
        taskDTO1.setCreatedAt(now);
        taskDTO1.setUpdatedAt(now);
        taskDTO1.setProjectId(1L);
        taskDTO1.setProjectName("Test Project");
        taskDTO1.setAssignedToId(1L);
        taskDTO1.setAssignedToName("testuser");
        taskDTO1.setCreatedById(1L);
        taskDTO1.setCreatedByName("admin");

        taskDTO2 = new TaskDTO();
        taskDTO2.setId(1L);
        taskDTO2.setTitle("Test Task 1");
        taskDTO2.setDescription("Test Description 1");
        taskDTO2.setPriority(TaskPriority.HIGH);
        taskDTO2.setStatus(TaskStatusEnum.IN_PROGRESS);
        taskDTO2.setDueDate(now);
        taskDTO2.setCreatedAt(now);
        taskDTO2.setUpdatedAt(now);
        taskDTO2.setProjectId(1L);
        taskDTO2.setProjectName("Test Project");
        taskDTO2.setAssignedToId(1L);
        taskDTO2.setAssignedToName("testuser");
        taskDTO2.setCreatedById(1L);
        taskDTO2.setCreatedByName("admin");
    }

    @Test
    void testTaskDTOGettersAndSetters() {
        // Given
        TaskDTO taskDTO = new TaskDTO();
        LocalDateTime now = LocalDateTime.now();

        // When
        taskDTO.setId(1L);
        taskDTO.setTitle("Test Task");
        taskDTO.setDescription("Test Description");
        taskDTO.setPriority(TaskPriority.MEDIUM);
        taskDTO.setStatus(TaskStatusEnum.TODO);
        taskDTO.setDueDate(now);
        taskDTO.setCreatedAt(now);
        taskDTO.setUpdatedAt(now);
        taskDTO.setProjectId(1L);
        taskDTO.setProjectName("Test Project");
        taskDTO.setAssignedToId(1L);
        taskDTO.setAssignedToName("testuser");
        taskDTO.setCreatedById(1L);
        taskDTO.setCreatedByName("admin");

        // Then
        assertEquals(1L, taskDTO.getId());
        assertEquals("Test Task", taskDTO.getTitle());
        assertEquals("Test Description", taskDTO.getDescription());
        assertEquals(TaskPriority.MEDIUM, taskDTO.getPriority());
        assertEquals(TaskStatusEnum.TODO, taskDTO.getStatus());
        assertEquals(now, taskDTO.getDueDate());
        assertEquals(now, taskDTO.getCreatedAt());
        assertEquals(now, taskDTO.getUpdatedAt());
        assertEquals(1L, taskDTO.getProjectId());
        assertEquals("Test Project", taskDTO.getProjectName());
        assertEquals(1L, taskDTO.getAssignedToId());
        assertEquals("testuser", taskDTO.getAssignedToName());
        assertEquals(1L, taskDTO.getCreatedById());
        assertEquals("admin", taskDTO.getCreatedByName());
    }

    @Test
    void testTaskDTOToString() {
        // Given
        TaskDTO dto = new TaskDTO();
        dto.setId(1L);
        dto.setTitle("Test Task");
        dto.setDescription("Test Description");

        // When
        String result = dto.toString();

        // Then
        assertNotNull(result);
        assertFalse(result.isEmpty());
    }
} 