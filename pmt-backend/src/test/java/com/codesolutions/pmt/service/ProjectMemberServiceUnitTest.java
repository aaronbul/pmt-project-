package com.codesolutions.pmt.service;

import com.codesolutions.pmt.dto.ProjectMemberCreateDTO;
import com.codesolutions.pmt.entity.Project;
import com.codesolutions.pmt.entity.ProjectMember;
import com.codesolutions.pmt.entity.Role;
import com.codesolutions.pmt.entity.User;
import com.codesolutions.pmt.repository.ProjectMemberRepository;
import com.codesolutions.pmt.repository.ProjectRepository;
import com.codesolutions.pmt.repository.RoleRepository;
import com.codesolutions.pmt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectMemberServiceUnitTest {

    @Mock
    private ProjectMemberRepository projectMemberRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private ProjectMemberService projectMemberService;

    private User testUser;
    private Project testProject;
    private Role testRole;
    private ProjectMember testProjectMember;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        testProject = new Project();
        testProject.setId(1L);
        testProject.setName("Test Project");

        testRole = new Role();
        testRole.setId(1);
        testRole.setName("MEMBER");

        testProjectMember = new ProjectMember();
        testProjectMember.setId(1L);
        testProjectMember.setUser(testUser);
        testProjectMember.setProject(testProject);
        testProjectMember.setRole(testRole);
        testProjectMember.setJoinedAt(LocalDateTime.now());
    }

    @Test
    void testGetAllProjectMembers() {
        // Given
        List<ProjectMember> members = Arrays.asList(testProjectMember);
        when(projectMemberRepository.findAll()).thenReturn(members);

        // When
        List<ProjectMember> result = projectMemberService.getAllProjectMembers();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getId());
        verify(projectMemberRepository).findAll();
    }

    @Test
    void testGetProjectMemberById() {
        // Given
        when(projectMemberRepository.findById(1L)).thenReturn(Optional.of(testProjectMember));

        // When
        ProjectMember result = projectMemberService.getProjectMemberById(1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(projectMemberRepository).findById(1L);
    }

    @Test
    void testGetProjectMemberById_NotFound() {
        // Given
        when(projectMemberRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            projectMemberService.getProjectMemberById(999L);
        });
        verify(projectMemberRepository).findById(999L);
    }

    @Test
    void testGetMembersByProject() {
        // Given
        List<ProjectMember> members = Arrays.asList(testProjectMember);
        when(projectMemberRepository.findByProjectIdWithRelations(1L)).thenReturn(members);

        // When
        List<ProjectMember> result = projectMemberService.getMembersByProject(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getProject().getId());
        verify(projectMemberRepository).findByProjectIdWithRelations(1L);
    }

    @Test
    void testGetProjectsByUser() {
        // Given
        List<ProjectMember> members = Arrays.asList(testProjectMember);
        when(projectMemberRepository.findByUserIdWithRelations(1L)).thenReturn(members);

        // When
        List<ProjectMember> result = projectMemberService.getProjectsByUser(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getUser().getId());
        verify(projectMemberRepository).findByUserIdWithRelations(1L);
    }

    @Test
    void testGetMembersByRole() {
        // Given
        List<ProjectMember> members = Arrays.asList(testProjectMember);
        when(projectMemberRepository.findByRoleIdWithRelations(1)).thenReturn(members);

        // When
        List<ProjectMember> result = projectMemberService.getMembersByRole(1);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1, result.get(0).getRole().getId());
        verify(projectMemberRepository).findByRoleIdWithRelations(1);
    }

    @Test
    void testAddProjectMember() {
        // Given
        ProjectMemberCreateDTO createDTO = new ProjectMemberCreateDTO();
        createDTO.setProjectId(1L);
        createDTO.setUserId(1L);
        createDTO.setRoleId(1);

        when(projectMemberRepository.findByProjectIdAndUserId(1L, 1L)).thenReturn(Optional.empty());
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(roleRepository.findById(1)).thenReturn(Optional.of(testRole));
        when(projectMemberRepository.save(any(ProjectMember.class))).thenReturn(testProjectMember);

        // When
        ProjectMember result = projectMemberService.addProjectMember(createDTO);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(projectMemberRepository).findByProjectIdAndUserId(1L, 1L);
        verify(projectRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(roleRepository).findById(1);
        verify(projectMemberRepository).save(any(ProjectMember.class));
    }

    @Test
    void testAddProjectMember_AlreadyExists() {
        // Given
        ProjectMemberCreateDTO createDTO = new ProjectMemberCreateDTO();
        createDTO.setProjectId(1L);
        createDTO.setUserId(1L);
        createDTO.setRoleId(1);

        when(projectMemberRepository.findByProjectIdAndUserId(1L, 1L)).thenReturn(Optional.of(testProjectMember));

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            projectMemberService.addProjectMember(createDTO);
        });
        verify(projectMemberRepository).findByProjectIdAndUserId(1L, 1L);
    }

    @Test
    void testAddProjectMember_ProjectNotFound() {
        // Given
        ProjectMemberCreateDTO createDTO = new ProjectMemberCreateDTO();
        createDTO.setProjectId(999L);
        createDTO.setUserId(1L);
        createDTO.setRoleId(1);

        when(projectMemberRepository.findByProjectIdAndUserId(999L, 1L)).thenReturn(Optional.empty());
        when(projectRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            projectMemberService.addProjectMember(createDTO);
        });
        verify(projectMemberRepository).findByProjectIdAndUserId(999L, 1L);
        verify(projectRepository).findById(999L);
    }

    @Test
    void testAddProjectMember_UserNotFound() {
        // Given
        ProjectMemberCreateDTO createDTO = new ProjectMemberCreateDTO();
        createDTO.setProjectId(1L);
        createDTO.setUserId(999L);
        createDTO.setRoleId(1);

        when(projectMemberRepository.findByProjectIdAndUserId(1L, 999L)).thenReturn(Optional.empty());
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            projectMemberService.addProjectMember(createDTO);
        });
        verify(projectMemberRepository).findByProjectIdAndUserId(1L, 999L);
        verify(projectRepository).findById(1L);
        verify(userRepository).findById(999L);
    }

    @Test
    void testAddProjectMember_RoleNotFound() {
        // Given
        ProjectMemberCreateDTO createDTO = new ProjectMemberCreateDTO();
        createDTO.setProjectId(1L);
        createDTO.setUserId(1L);
        createDTO.setRoleId(999);

        when(projectMemberRepository.findByProjectIdAndUserId(1L, 1L)).thenReturn(Optional.empty());
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(roleRepository.findById(999)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            projectMemberService.addProjectMember(createDTO);
        });
        verify(projectMemberRepository).findByProjectIdAndUserId(1L, 1L);
        verify(projectRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(roleRepository).findById(999);
    }

    @Test
    void testUpdateMemberRole() {
        // Given
        Role newRole = new Role();
        newRole.setId(2);
        newRole.setName("ADMIN");

        when(projectMemberRepository.findById(1L)).thenReturn(Optional.of(testProjectMember));
        when(roleRepository.findById(2)).thenReturn(Optional.of(newRole));
        when(projectMemberRepository.save(any(ProjectMember.class))).thenReturn(testProjectMember);

        // When
        ProjectMember result = projectMemberService.updateMemberRole(1L, 2);

        // Then
        assertNotNull(result);
        verify(projectMemberRepository).findById(1L);
        verify(roleRepository).findById(2);
        verify(projectMemberRepository).save(any(ProjectMember.class));
    }

    @Test
    void testUpdateMemberRole_RoleNotFound() {
        // Given
        when(projectMemberRepository.findById(1L)).thenReturn(Optional.of(testProjectMember));
        when(roleRepository.findById(999)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            projectMemberService.updateMemberRole(1L, 999);
        });
        verify(projectMemberRepository).findById(1L);
        verify(roleRepository).findById(999);
    }

    @Test
    void testRemoveProjectMember() {
        // Given
        when(projectMemberRepository.findById(1L)).thenReturn(Optional.of(testProjectMember));

        // When
        projectMemberService.removeProjectMember(1L);

        // Then
        verify(projectMemberRepository).findById(1L);
        verify(projectMemberRepository).delete(testProjectMember);
    }

    @Test
    void testGetProjectMembership() {
        // Given
        when(projectMemberRepository.findByProjectIdAndUserId(1L, 1L)).thenReturn(Optional.of(testProjectMember));

        // When
        ProjectMember result = projectMemberService.getProjectMembership(1L, 1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(projectMemberRepository).findByProjectIdAndUserId(1L, 1L);
    }

    @Test
    void testGetProjectMembership_NotFound() {
        // Given
        when(projectMemberRepository.findByProjectIdAndUserId(1L, 999L)).thenReturn(Optional.empty());

        // When
        ProjectMember result = projectMemberService.getProjectMembership(1L, 999L);

        // Then
        assertNull(result);
        verify(projectMemberRepository).findByProjectIdAndUserId(1L, 999L);
    }

    @Test
    void testHasRoleInProject() {
        // Given
        when(projectMemberRepository.findByProjectIdAndUserId(1L, 1L)).thenReturn(Optional.of(testProjectMember));

        // When
        boolean result = projectMemberService.hasRoleInProject(1L, 1L, "MEMBER");

        // Then
        assertTrue(result);
        verify(projectMemberRepository).findByProjectIdAndUserId(1L, 1L);
    }

    @Test
    void testHasRoleInProject_NotFound() {
        // Given
        when(projectMemberRepository.findByProjectIdAndUserId(1L, 999L)).thenReturn(Optional.empty());

        // When
        boolean result = projectMemberService.hasRoleInProject(1L, 999L, "MEMBER");

        // Then
        assertFalse(result);
        verify(projectMemberRepository).findByProjectIdAndUserId(1L, 999L);
    }

    @Test
    void testGetProjectMemberCount() {
        // Given
        when(projectMemberRepository.countByProjectId(1L)).thenReturn(5L);

        // When
        long count = projectMemberService.getProjectMemberCount(1L);

        // Then
        assertEquals(5L, count);
        verify(projectMemberRepository).countByProjectId(1L);
    }
}
