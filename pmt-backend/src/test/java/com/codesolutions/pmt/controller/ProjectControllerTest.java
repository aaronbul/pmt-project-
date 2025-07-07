package com.codesolutions.pmt.controller;

import com.codesolutions.pmt.config.TestSecurityConfig;
import com.codesolutions.pmt.dto.ProjectDTO;
import com.codesolutions.pmt.dto.ProjectMemberDTO;
import com.codesolutions.pmt.service.ProjectService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProjectController.class)
@Import(TestSecurityConfig.class)
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProjectService projectService;

    @Autowired
    private ObjectMapper objectMapper;

    private ProjectDTO testProjectDto;

    @BeforeEach
    void setUp() {
        testProjectDto = new ProjectDTO();
        testProjectDto.setId(1L);
        testProjectDto.setName("Test Project");
        testProjectDto.setDescription("Test Description");
        testProjectDto.setStartDate(LocalDate.now());
        testProjectDto.setCreatedById(1L);
        testProjectDto.setCreatedByUsername("testuser");
        testProjectDto.setCreatedAt(LocalDateTime.now());
        testProjectDto.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void createProject_Success() throws Exception {
        // Given
        when(projectService.createProject(any(ProjectDTO.class), anyLong())).thenReturn(testProjectDto);

        // When & Then
        mockMvc.perform(post("/api/projects")
                .param("createdById", "1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testProjectDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test Project"));

        verify(projectService).createProject(any(ProjectDTO.class), eq(1L));
    }

    @Test
    void getProjectById_Success() throws Exception {
        // Given
        when(projectService.findById(1L)).thenReturn(testProjectDto);

        // When & Then
        mockMvc.perform(get("/api/projects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test Project"));

        verify(projectService).findById(1L);
    }

    @Test
    void getProjectById_NotFound() throws Exception {
        // Given
        when(projectService.findById(999L))
                .thenThrow(new RuntimeException("Projet non trouvé avec l'ID: 999"));

        // When & Then
        mockMvc.perform(get("/api/projects/999"))
                .andExpect(status().isNotFound());

        verify(projectService).findById(999L);
    }

    @Test
    void getAllProjects_Success() throws Exception {
        // Given
        ProjectDTO project2 = new ProjectDTO();
        project2.setId(2L);
        project2.setName("Project 2");

        List<ProjectDTO> projects = Arrays.asList(testProjectDto, project2);
        when(projectService.findAll()).thenReturn(projects);

        // When & Then
        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Test Project"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].name").value("Project 2"));

        verify(projectService).findAll();
    }

    @Test
    void updateProject_Success() throws Exception {
        // Given
        when(projectService.updateProject(anyLong(), any(ProjectDTO.class))).thenReturn(testProjectDto);

        // When & Then
        mockMvc.perform(put("/api/projects/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testProjectDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test Project"));

        verify(projectService).updateProject(eq(1L), any(ProjectDTO.class));
    }

    @Test
    void deleteProject_Success() throws Exception {
        // Given
        doNothing().when(projectService).deleteProject(1L);

        // When & Then
        mockMvc.perform(delete("/api/projects/1"))
                .andExpect(status().isNoContent());

        verify(projectService).deleteProject(1L);
    }

    @Test
    void addMemberToProject_Success() throws Exception {
        // Given
        ProjectMemberDTO memberDto = new ProjectMemberDTO();
        memberDto.setId(1L);
        memberDto.setUserId(1L);
        memberDto.setUsername("testuser");
        memberDto.setRoleName("ADMIN");

        when(projectService.addMemberToProject(anyLong(), anyLong(), anyString())).thenReturn(memberDto);

        // When & Then
        mockMvc.perform(post("/api/projects/1/members")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\": 1, \"roleName\": \"ADMIN\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value("testuser"));

        verify(projectService).addMemberToProject(1L, 1L, "ADMIN");
    }

    @Test
    void removeMemberFromProject_Success() throws Exception {
        // Given
        doNothing().when(projectService).removeMemberFromProject(1L, 1L);

        // When & Then
        mockMvc.perform(delete("/api/projects/1/members/1"))
                .andExpect(status().isNoContent());

        verify(projectService).removeMemberFromProject(1L, 1L);
    }

    @Test
    void changeMemberRole_Success() throws Exception {
        // Given
        ProjectMemberDTO memberDto = new ProjectMemberDTO();
        memberDto.setId(1L);
        memberDto.setRoleName("MEMBER");

        when(projectService.changeMemberRole(anyLong(), anyLong(), anyString())).thenReturn(memberDto);

        // When & Then
        mockMvc.perform(put("/api/projects/1/members/1/role")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"roleName\": \"MEMBER\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roleName").value("MEMBER"));

        verify(projectService).changeMemberRole(1L, 1L, "MEMBER");
    }
} 