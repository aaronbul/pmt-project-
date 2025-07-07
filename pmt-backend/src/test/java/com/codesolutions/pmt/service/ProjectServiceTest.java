package com.codesolutions.pmt.service;

import com.codesolutions.pmt.dto.ProjectDTO;
import com.codesolutions.pmt.entity.Project;
import com.codesolutions.pmt.entity.User;
import com.codesolutions.pmt.entity.Role;
import com.codesolutions.pmt.repository.ProjectRepository;
import com.codesolutions.pmt.repository.UserRepository;
import com.codesolutions.pmt.repository.RoleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserService userService;

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private ProjectService projectService;

    private Project testProject;
    private ProjectDTO testProjectDto;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");

        testProject = new Project();
        testProject.setId(1L);
        testProject.setName("Test Project");
        testProject.setDescription("Test Description");
        testProject.setStartDate(LocalDate.now());
        testProject.setCreatedBy(testUser);
        testProject.setCreatedAt(LocalDateTime.now());
        testProject.setUpdatedAt(LocalDateTime.now());

        testProjectDto = new ProjectDTO();
        testProjectDto.setName("Test Project");
        testProjectDto.setDescription("Test Description");
        testProjectDto.setStartDate(LocalDate.now());
    }

    @Test
    void createProject_Success() {
        // Given
        Role adminRole = new Role();
        adminRole.setId(1);
        adminRole.setName("ADMIN");
        
        when(userService.findUserEntityById(1L)).thenReturn(testUser);
        when(projectRepository.save(any(Project.class))).thenReturn(testProject);
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(roleRepository.findByName("ADMIN")).thenReturn(Optional.of(adminRole));

        // When
        ProjectDTO result = projectService.createProject(testProjectDto, 1L);

        // Then
        assertNotNull(result);
        assertEquals(testProject.getName(), result.getName());
        assertEquals(testProject.getDescription(), result.getDescription());
        verify(userService, times(2)).findUserEntityById(1L);
        verify(projectRepository, times(2)).save(any(Project.class));
        verify(projectRepository).findById(1L);
        verify(roleRepository).findByName("ADMIN");
    }

    @Test
    void createProject_UserNotFound_ThrowsException() {
        // Given
        when(userService.findUserEntityById(1L)).thenThrow(new RuntimeException("Utilisateur non trouvé avec l'ID: 1"));

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            projectService.createProject(testProjectDto, 1L);
        });
        assertEquals("Utilisateur non trouvé avec l'ID: 1", exception.getMessage());
        verify(userService).findUserEntityById(1L);
        verify(projectRepository, never()).save(any(Project.class));
    }

    @Test
    void findById_Success() {
        // Given
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));

        // When
        ProjectDTO result = projectService.findById(1L);

        // Then
        assertNotNull(result);
        assertEquals(testProject.getName(), result.getName());
        assertEquals(testProject.getDescription(), result.getDescription());
        verify(projectRepository).findById(1L);
    }

    @Test
    void findById_ProjectNotFound_ThrowsException() {
        // Given
        when(projectRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            projectService.findById(1L);
        });
        assertEquals("Projet non trouvé avec l'ID: 1", exception.getMessage());
        verify(projectRepository).findById(1L);
    }

    @Test
    void findAll_Success() {
        // Given
        Project project2 = new Project();
        project2.setId(2L);
        project2.setName("Project 2");
        project2.setDescription("Description 2");
        project2.setCreatedBy(testUser);
        
        when(projectRepository.findAll()).thenReturn(Arrays.asList(testProject, project2));

        // When
        List<ProjectDTO> result = projectService.findAll();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(testProject.getName(), result.get(0).getName());
        assertEquals(project2.getName(), result.get(1).getName());
        verify(projectRepository).findAll();
    }

    @Test
    void updateProject_Success() {
        // Given
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(projectRepository.save(any(Project.class))).thenReturn(testProject);

        // When
        ProjectDTO result = projectService.updateProject(1L, testProjectDto);

        // Then
        assertNotNull(result);
        assertEquals(testProject.getName(), result.getName());
        verify(projectRepository).findById(1L);
        verify(projectRepository).save(any(Project.class));
    }

    @Test
    void updateProject_ProjectNotFound_ThrowsException() {
        // Given
        when(projectRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            projectService.updateProject(1L, testProjectDto);
        });
        assertEquals("Projet non trouvé avec l'ID: 1", exception.getMessage());
        verify(projectRepository).findById(1L);
        verify(projectRepository, never()).save(any(Project.class));
    }

    @Test
    void deleteProject_Success() {
        // Given
        when(projectRepository.existsById(1L)).thenReturn(true);

        // When
        projectService.deleteProject(1L);

        // Then
        verify(projectRepository).existsById(1L);
        verify(projectRepository).deleteById(1L);
    }

    @Test
    void deleteProject_ProjectNotFound_ThrowsException() {
        // Given
        when(projectRepository.existsById(1L)).thenReturn(false);

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            projectService.deleteProject(1L);
        });
        assertEquals("Projet non trouvé avec l'ID: 1", exception.getMessage());
        verify(projectRepository).existsById(1L);
        verify(projectRepository, never()).deleteById(anyLong());
    }

    @Test
    void findProjectsByUserId_Success() {
        // Given
        Project project2 = new Project();
        project2.setId(2L);
        project2.setName("Project 2");
        project2.setCreatedBy(testUser);
        
        when(projectRepository.findProjectsByUserId(1L)).thenReturn(Arrays.asList(testProject, project2));

        // When
        List<ProjectDTO> result = projectService.findProjectsByUserId(1L);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(testProject.getName(), result.get(0).getName());
        assertEquals(project2.getName(), result.get(1).getName());
        verify(projectRepository).findProjectsByUserId(1L);
    }
} 