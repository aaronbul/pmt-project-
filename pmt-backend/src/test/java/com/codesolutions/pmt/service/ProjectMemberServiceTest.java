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
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ProjectMemberServiceTest {

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

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllProjectMembers() {
        // Given
        ProjectMember member1 = new ProjectMember();
        member1.setId(1L);
        ProjectMember member2 = new ProjectMember();
        member2.setId(2L);
        List<ProjectMember> members = Arrays.asList(member1, member2);

        when(projectMemberRepository.findAll()).thenReturn(members);

        // When
        List<ProjectMember> result = projectMemberService.getAllProjectMembers();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(projectMemberRepository).findAll();
    }

    @Test
    void testGetMembersByProject() {
        // Given
        Long projectId = 1L;
        ProjectMember member = new ProjectMember();
        member.setId(1L);
        
        // Initialiser les objets nécessaires pour éviter les NullPointerException
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        member.setUser(user);
        
        Role role = new Role();
        role.setId(1);
        role.setName("MEMBER");
        member.setRole(role);
        
        List<ProjectMember> members = Arrays.asList(member);

        when(projectMemberRepository.findByProjectIdWithRelations(projectId)).thenReturn(members);

        // When
        List<ProjectMember> result = projectMemberService.getMembersByProject(projectId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(projectMemberRepository).findByProjectIdWithRelations(projectId);
    }

    @Test
    void testAddProjectMember() {
        // Given
        ProjectMemberCreateDTO createDTO = new ProjectMemberCreateDTO();
        createDTO.setProjectId(1L);
        createDTO.setUserId(1L);
        createDTO.setRoleId(1);

        Project project = new Project();
        project.setId(1L);
        User user = new User();
        user.setId(1L);
        Role role = new Role();
        role.setId(1);

        when(projectMemberRepository.findByProjectIdAndUserId(1L, 1L)).thenReturn(Optional.empty());
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(roleRepository.findById(1)).thenReturn(Optional.of(role));
        when(projectMemberRepository.save(any(ProjectMember.class))).thenReturn(new ProjectMember());

        // When
        ProjectMember result = projectMemberService.addProjectMember(createDTO);

        // Then
        assertNotNull(result);
        verify(projectMemberRepository).findByProjectIdAndUserId(1L, 1L);
        verify(projectRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(roleRepository).findById(1);
        verify(projectMemberRepository).save(any(ProjectMember.class));
    }

    @Test
    void testRemoveProjectMember() {
        // Given
        Long memberId = 1L;
        ProjectMember member = new ProjectMember();
        member.setId(memberId);

        when(projectMemberRepository.findById(memberId)).thenReturn(Optional.of(member));
        doNothing().when(projectMemberRepository).delete(member);

        // When
        projectMemberService.removeProjectMember(memberId);

        // Then
        verify(projectMemberRepository).findById(memberId);
        verify(projectMemberRepository).delete(member);
    }

    @Test
    void testGetProjectMemberById() {
        // Given
        Long memberId = 1L;
        ProjectMember member = new ProjectMember();
        member.setId(memberId);

        when(projectMemberRepository.findById(memberId)).thenReturn(Optional.of(member));

        // When
        ProjectMember result = projectMemberService.getProjectMemberById(memberId);

        // Then
        assertNotNull(result);
        assertEquals(memberId, result.getId());
        verify(projectMemberRepository).findById(memberId);
    }

    @Test
    void testGetProjectMemberCount() {
        // Given
        Long projectId = 1L;
        when(projectMemberRepository.countByProjectId(projectId)).thenReturn(5L);

        // When
        long result = projectMemberService.getProjectMemberCount(projectId);

        // Then
        assertEquals(5L, result);
        verify(projectMemberRepository).countByProjectId(projectId);
    }
} 