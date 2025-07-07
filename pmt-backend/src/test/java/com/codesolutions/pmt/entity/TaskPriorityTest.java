package com.codesolutions.pmt.entity;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TaskPriorityTest {
    @Test
    void testTaskPriorityValues() {
        assertEquals(TaskPriority.LOW, TaskPriority.valueOf("LOW"));
        assertEquals(TaskPriority.MEDIUM, TaskPriority.valueOf("MEDIUM"));
        assertEquals(TaskPriority.HIGH, TaskPriority.valueOf("HIGH"));
    }

    @Test
    void testTaskPriorityToString() {
        assertEquals("LOW", TaskPriority.LOW.toString());
        assertEquals("MEDIUM", TaskPriority.MEDIUM.toString());
        assertEquals("HIGH", TaskPriority.HIGH.toString());
    }
} 