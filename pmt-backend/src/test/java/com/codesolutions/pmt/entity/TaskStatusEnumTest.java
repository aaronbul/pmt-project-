package com.codesolutions.pmt.entity;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TaskStatusEnumTest {
    @Test
    void testTaskStatusEnumValues() {
        assertEquals(TaskStatusEnum.TODO, TaskStatusEnum.valueOf("TODO"));
        assertEquals(TaskStatusEnum.IN_PROGRESS, TaskStatusEnum.valueOf("IN_PROGRESS"));
        assertEquals(TaskStatusEnum.DONE, TaskStatusEnum.valueOf("DONE"));
    }

    @Test
    void testTaskStatusEnumToString() {
        assertEquals("TODO", TaskStatusEnum.TODO.toString());
        assertEquals("IN_PROGRESS", TaskStatusEnum.IN_PROGRESS.toString());
        assertEquals("DONE", TaskStatusEnum.DONE.toString());
    }
} 