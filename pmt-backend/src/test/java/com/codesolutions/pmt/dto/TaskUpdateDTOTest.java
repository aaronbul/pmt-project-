package com.codesolutions.pmt.dto;

import com.codesolutions.pmt.entity.TaskPriority;
import com.codesolutions.pmt.entity.TaskStatusEnum;
import org.junit.jupiter.api.Test;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class TaskUpdateDTOTest {
    @Test
    void testTaskUpdateDTOGettersSetters() {
        TaskUpdateDTO dto = new TaskUpdateDTO();
        dto.setTitle("Test Task");
        dto.setDescription("Description");
        dto.setDueDate(LocalDate.now());
        dto.setPriority(TaskPriority.HIGH);
        dto.setStatus("IN_PROGRESS");
        dto.setAssignedToId(2L);

        assertEquals("Test Task", dto.getTitle());
        assertEquals("Description", dto.getDescription());
        assertNotNull(dto.getDueDate());
        assertEquals(TaskPriority.HIGH, dto.getPriority());
        assertEquals("IN_PROGRESS", dto.getStatus());
        assertEquals(TaskStatusEnum.IN_PROGRESS, dto.getStatusEnum());
        assertEquals(2L, dto.getAssignedToId());
    }

    @Test
    void testTaskUpdateDTOToString() {
        TaskUpdateDTO dto = new TaskUpdateDTO();
        dto.setTitle("Test Task");
        String result = dto.toString();
        assertNotNull(result);
        assertFalse(result.isEmpty());
    }
} 