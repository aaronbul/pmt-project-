package com.codesolutions.pmt.dto;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class UserDTOTest {

    private UserDTO userDTO;

    @BeforeEach
    void setUp() {
        userDTO = new UserDTO();
        userDTO.setId(1L);
        userDTO.setUsername("testuser");
        userDTO.setEmail("test@example.com");
        userDTO.setPassword("password123");
        userDTO.setCreatedAt(LocalDateTime.now());
        userDTO.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void testUserDTOGettersAndSetters() {
        // Given
        UserDTO dto = new UserDTO();
        LocalDateTime now = LocalDateTime.now();

        // When
        dto.setId(1L);
        dto.setUsername("newuser");
        dto.setEmail("new@example.com");
        dto.setPassword("newpassword");
        dto.setCreatedAt(now);
        dto.setUpdatedAt(now);

        // Then
        assertEquals(1L, dto.getId());
        assertEquals("newuser", dto.getUsername());
        assertEquals("new@example.com", dto.getEmail());
        assertEquals("newpassword", dto.getPassword());
        assertEquals(now, dto.getCreatedAt());
        assertEquals(now, dto.getUpdatedAt());
    }

    @Test
    void testUserDTOConstructor() {
        // When
        UserDTO testDto = new UserDTO("testuser", "test@example.com", "password123");

        // Then
        assertEquals("testuser", testDto.getUsername());
        assertEquals("test@example.com", testDto.getEmail());
        assertEquals("password123", testDto.getPassword());
    }

    @Test
    void testUserDTOToString() {
        // When
        String result = userDTO.toString();

        // Then
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertTrue(result.contains("testuser") || result.contains("1"));
    }

    @Test
    void testUserDTOGettersSetters() {
        UserDTO dto = new UserDTO();
        dto.setId(1L);
        dto.setUsername("testuser");
        dto.setEmail("test@example.com");

        assertEquals(1L, dto.getId());
        assertEquals("testuser", dto.getUsername());
        assertEquals("test@example.com", dto.getEmail());
    }
} 