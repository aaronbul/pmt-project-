package com.codesolutions.pmt.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RoleTest {

    private Role role;

    @BeforeEach
    void setUp() {
        role = new Role();
        role.setId(1);
        role.setName("ADMIN");
    }

    @Test
    void testRoleGettersAndSetters() {
        // Given
        Role r = new Role();

        // When
        r.setId(1);
        r.setName("MEMBER");

        // Then
        assertEquals(1, r.getId());
        assertEquals("MEMBER", r.getName());
    }

    @Test
    void testRoleToString() {
        // When
        String result = role.toString();

        // Then
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertTrue(result.contains("1") || result.contains("id"));
    }

    @Test
    void testRoleConstructor() {
        // When
        Role testRole = new Role("OBSERVER");

        // Then
        assertEquals("OBSERVER", testRole.getName());
    }
} 