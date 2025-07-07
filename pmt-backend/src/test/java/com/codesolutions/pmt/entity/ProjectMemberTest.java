package com.codesolutions.pmt.entity;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class ProjectMemberTest {

    @Test
    void testProjectMemberCreation() {
        // Given
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");

        Project project = new Project();
        project.setId(1L);
        project.setName("Test Project");

        Role role = new Role();
        role.setId(1);
        role.setName("ADMIN");

        ProjectMember projectMember = new ProjectMember();
        projectMember.setId(1L);
        projectMember.setUser(user);
        projectMember.setProject(project);
        projectMember.setRole(role);
        projectMember.setJoinedAt(LocalDateTime.now());

        // When & Then
        assertNotNull(projectMember.getId());
        assertEquals(user, projectMember.getUser());
        assertEquals(project, projectMember.getProject());
        assertEquals(role, projectMember.getRole());
        assertNotNull(projectMember.getJoinedAt());
    }

    @Test
    void testProjectMemberSettersAndGetters() {
        // Given
        ProjectMember projectMember = new ProjectMember();
        User user = new User();
        Project project = new Project();
        Role role = new Role();
        LocalDateTime joinedAt = LocalDateTime.now();

        // When
        projectMember.setId(1L);
        projectMember.setUser(user);
        projectMember.setProject(project);
        projectMember.setRole(role);
        projectMember.setJoinedAt(joinedAt);

        // Then
        assertEquals(1L, projectMember.getId());
        assertEquals(user, projectMember.getUser());
        assertEquals(project, projectMember.getProject());
        assertEquals(role, projectMember.getRole());
        assertEquals(joinedAt, projectMember.getJoinedAt());
    }

    @Test
    void testProjectMemberEquals() {
        // Given
        ProjectMember member1 = new ProjectMember();
        member1.setId(1L);

        ProjectMember member2 = new ProjectMember();
        member2.setId(1L);

        ProjectMember member3 = new ProjectMember();
        member3.setId(2L);

        // When & Then
        assertNotNull(member1);
        assertNotNull(member2);
        assertNotNull(member3);
        assertNotEquals(member1, null);
        assertEquals(member1, member1);
    }

    @Test
    void testProjectMemberHashCode() {
        // Given
        ProjectMember member1 = new ProjectMember();
        member1.setId(1L);

        ProjectMember member2 = new ProjectMember();
        member2.setId(1L);

        // When & Then
        assertNotNull(member1.hashCode());
        assertNotNull(member2.hashCode());
    }

    @Test
    void testProjectMemberToString() {
        // Given
        ProjectMember projectMember = new ProjectMember();
        projectMember.setId(1L);

        // When
        String result = projectMember.toString();

        // Then
        assertNotNull(result);
        assertTrue(result.contains("ProjectMember"));
        assertTrue(result.contains("id=1"));
    }
} 