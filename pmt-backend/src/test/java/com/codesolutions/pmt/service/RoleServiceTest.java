package com.codesolutions.pmt.service;

import com.codesolutions.pmt.entity.Role;
import com.codesolutions.pmt.repository.RoleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RoleServiceTest {

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private RoleService roleService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllRoles() {
        // Given
        Role role1 = new Role();
        role1.setId(1);
        role1.setName("ADMIN");
        Role role2 = new Role();
        role2.setId(2);
        role2.setName("MEMBER");
        List<Role> roles = Arrays.asList(role1, role2);

        when(roleRepository.findAll()).thenReturn(roles);

        // When
        List<Role> result = roleService.getAllRoles();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("ADMIN", result.get(0).getName());
        assertEquals("MEMBER", result.get(1).getName());
        verify(roleRepository).findAll();
    }

    @Test
    void testGetRoleById() {
        // Given
        Integer roleId = 1;
        Role role = new Role();
        role.setId(roleId);
        role.setName("ADMIN");

        when(roleRepository.findById(roleId)).thenReturn(Optional.of(role));

        // When
        Role result = roleService.getRoleById(roleId);

        // Then
        assertNotNull(result);
        assertEquals(roleId, result.getId());
        assertEquals("ADMIN", result.getName());
        verify(roleRepository).findById(roleId);
    }

    @Test
    void testGetRoleByIdNotFound() {
        // Given
        Integer roleId = 999;
        when(roleRepository.findById(roleId)).thenReturn(Optional.empty());

        // When
        Role result = roleService.getRoleById(roleId);

        // Then
        assertNull(result);
        verify(roleRepository).findById(roleId);
    }

    @Test
    void testGetRoleByName() {
        // Given
        String roleName = "ADMIN";
        Role role = new Role();
        role.setId(1);
        role.setName(roleName);

        when(roleRepository.findByName(roleName)).thenReturn(Optional.of(role));

        // When
        Role result = roleService.getRoleByName(roleName);

        // Then
        assertNotNull(result);
        assertEquals(roleName, result.getName());
        verify(roleRepository).findByName(roleName);
    }

    @Test
    void testGetRoleByNameNotFound() {
        // Given
        String roleName = "NON_EXISTENT";
        when(roleRepository.findByName(roleName)).thenReturn(Optional.empty());

        // When
        Role result = roleService.getRoleByName(roleName);

        // Then
        assertNull(result);
        verify(roleRepository).findByName(roleName);
    }
} 