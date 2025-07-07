package com.codesolutions.pmt.dto;

import com.codesolutions.pmt.entity.TaskPriority;
import com.codesolutions.pmt.entity.TaskStatusEnum;
import org.junit.jupiter.api.Test;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class TaskCreateDTOTest {
    @Test
    void testTaskCreateDTOGettersSetters() {
        TaskCreateDTO dto = new TaskCreateDTO();
        dto.setTitle("Test Task");
        dto.setDescription("Description");
        dto.setDueDate(LocalDate.now());
        dto.setPriority(TaskPriority.HIGH);
        dto.setStatus(TaskStatusEnum.IN_PROGRESS);
        dto.setProjectId(1L);
        dto.setAssignedToId(2L);
        dto.setCreatedById(3L);

        assertEquals("Test Task", dto.getTitle());
        assertEquals("Description", dto.getDescription());
        assertNotNull(dto.getDueDate());
        assertEquals(TaskPriority.HIGH, dto.getPriority());
        assertEquals(TaskStatusEnum.IN_PROGRESS, dto.getStatus());
        assertEquals(1L, dto.getProjectId());
        assertEquals(2L, dto.getAssignedToId());
        assertEquals(3L, dto.getCreatedById());
    }

    @Test
    void testTaskCreateDTOToString() {
        TaskCreateDTO dto = new TaskCreateDTO();
        dto.setTitle("Test Task");
        String result = dto.toString();
        assertNotNull(result);
        assertFalse(result.isEmpty());
    }
} 