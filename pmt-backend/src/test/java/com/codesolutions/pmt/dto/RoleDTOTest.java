package com.codesolutions.pmt.dto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RoleDTOTest {
    @Test
    void testRoleDTOGettersSetters() {
        RoleDTO dto = new RoleDTO();
        dto.setId(1);
        dto.setName("ADMIN");

        assertEquals(1, dto.getId());
        assertEquals("ADMIN", dto.getName());
    }

    @Test
    void testRoleDTOToString() {
        RoleDTO dto = new RoleDTO();
        dto.setId(1);
        dto.setName("ADMIN");
        String result = dto.toString();
        assertNotNull(result);
        assertFalse(result.isEmpty());
    }
} 