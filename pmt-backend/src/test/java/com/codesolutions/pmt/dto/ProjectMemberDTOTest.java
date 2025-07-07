package com.codesolutions.pmt.dto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ProjectMemberDTOTest {

    @Test
    void testProjectMemberDTOCreation() {
        // Given
        ProjectMemberDTO dto = new ProjectMemberDTO();
        dto.setId(1L);
        dto.setUserId(1L);
        dto.setProjectId(1L);
        dto.setRoleId(1);

        // When & Then
        assertEquals(1L, dto.getId());
        assertEquals(1L, dto.getUserId());
        assertEquals(1L, dto.getProjectId());
        assertEquals(1, dto.getRoleId());
    }

    @Test
    void testProjectMemberDTOSettersAndGetters() {
        // Given
        ProjectMemberDTO dto = new ProjectMemberDTO();

        // When
        dto.setId(2L);
        dto.setUserId(2L);
        dto.setProjectId(2L);
        dto.setRoleId(2);

        // Then
        assertEquals(2L, dto.getId());
        assertEquals(2L, dto.getUserId());
        assertEquals(2L, dto.getProjectId());
        assertEquals(2, dto.getRoleId());
    }

    @Test
    void testProjectMemberDTOEquals() {
        // Given
        ProjectMemberDTO dto1 = new ProjectMemberDTO();
        dto1.setId(1L);

        ProjectMemberDTO dto2 = new ProjectMemberDTO();
        dto2.setId(1L);

        ProjectMemberDTO dto3 = new ProjectMemberDTO();
        dto3.setId(2L);

        // When & Then
        assertNotNull(dto1);
        assertNotNull(dto2);
        assertNotNull(dto3);
        assertNotEquals(dto1, null);
        assertEquals(dto1, dto1);
    }

    @Test
    void testProjectMemberDTOHashCode() {
        // Given
        ProjectMemberDTO dto1 = new ProjectMemberDTO();
        dto1.setId(1L);

        ProjectMemberDTO dto2 = new ProjectMemberDTO();
        dto2.setId(1L);

        // When & Then
        assertNotNull(dto1.hashCode());
        assertNotNull(dto2.hashCode());
        assertEquals(dto1.hashCode(), dto1.hashCode());
    }

    @Test
    void testProjectMemberDTOToString() {
        // Given
        ProjectMemberDTO dto = new ProjectMemberDTO();
        dto.setId(1L);
        dto.setUserId(1L);
        dto.setProjectId(1L);
        dto.setRoleId(1);

        // When
        String result = dto.toString();

        // Then
        assertNotNull(result);
        assertTrue(result.contains("ProjectMemberDto"));
    }
} 