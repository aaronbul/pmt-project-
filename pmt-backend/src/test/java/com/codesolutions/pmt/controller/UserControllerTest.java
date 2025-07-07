package com.codesolutions.pmt.controller;

import com.codesolutions.pmt.config.TestSecurityConfig;
import com.codesolutions.pmt.dto.UserDTO;
import com.codesolutions.pmt.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@Import(TestSecurityConfig.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private UserDTO testUserDto;

    @BeforeEach
    void setUp() {
        testUserDto = new UserDTO();
        testUserDto.setId(1L);
        testUserDto.setUsername("testuser");
        testUserDto.setEmail("test@example.com");
        testUserDto.setCreatedAt(LocalDateTime.now());
        testUserDto.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void register_Success() throws Exception {
        // Given
        UserDTO createUserDto = new UserDTO();
        createUserDto.setUsername("newuser");
        createUserDto.setEmail("newuser@example.com");
        createUserDto.setPassword("password123");

        when(userService.createUser(any(UserDTO.class))).thenReturn(testUserDto);

        // When & Then
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createUserDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));

        verify(userService).createUser(any(UserDTO.class));
    }

    @Test
    void register_ValidationError() throws Exception {
        // Given
        UserDTO invalidUserDto = new UserDTO();
        // Pas de username ni email

        // When & Then
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidUserDto)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).createUser(any(UserDTO.class));
    }

    @Test
    void register_UsernameAlreadyExists() throws Exception {
        // Given
        UserDTO createUserDto = new UserDTO();
        createUserDto.setUsername("existinguser");
        createUserDto.setEmail("existinguser@example.com");
        createUserDto.setPassword("password123");

        when(userService.createUser(any(UserDTO.class)))
                .thenThrow(new RuntimeException("Le nom d'utilisateur existe déjà"));

        // When & Then
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createUserDto)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Le nom d'utilisateur existe déjà"));

        verify(userService).createUser(any(UserDTO.class));
    }

    @Test
    void login_Success() throws Exception {
        // Given
        when(userService.authenticate("test@example.com", "password123")).thenReturn(testUserDto);

        // When & Then
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"test@example.com\",\"password\":\"password123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));

        verify(userService).authenticate("test@example.com", "password123");
    }

    @Test
    void login_InvalidCredentials() throws Exception {
        // Given
        when(userService.authenticate("test@example.com", "wrongpassword"))
                .thenThrow(new RuntimeException("Email ou mot de passe incorrect"));

        // When & Then
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"test@example.com\",\"password\":\"wrongpassword\"}"))
                .andExpect(status().isUnauthorized());

        verify(userService).authenticate("test@example.com", "wrongpassword");
    }

    @Test
    void getUserById_Success() throws Exception {
        // Given
        when(userService.findById(1L)).thenReturn(testUserDto);

        // When & Then
        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));

        verify(userService).findById(1L);
    }

    @Test
    void getUserById_NotFound() throws Exception {
        // Given
        when(userService.findById(999L))
                .thenThrow(new RuntimeException("Utilisateur non trouvé avec l'ID: 999"));

        // When & Then
        mockMvc.perform(get("/api/users/999"))
                .andExpect(status().isNotFound());

        verify(userService).findById(999L);
    }

    @Test
    void getAllUsers_Success() throws Exception {
        // Given
        UserDTO user2 = new UserDTO();
        user2.setId(2L);
        user2.setUsername("user2");
        user2.setEmail("user2@example.com");

        List<UserDTO> users = Arrays.asList(testUserDto, user2);
        when(userService.findAll()).thenReturn(users);

        // When & Then
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].username").value("testuser"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].username").value("user2"));

        verify(userService).findAll();
    }

    @Test
    void getUserByUsername_Success() throws Exception {
        // Given
        when(userService.findByUsername("testuser")).thenReturn(testUserDto);

        // When & Then
        mockMvc.perform(get("/api/users/username/testuser"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));

        verify(userService).findByUsername("testuser");
    }

    @Test
    void getUserByEmail_Success() throws Exception {
        // Given
        when(userService.findByEmail("test@example.com")).thenReturn(testUserDto);

        // When & Then
        mockMvc.perform(get("/api/users/email/test@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));

        verify(userService).findByEmail("test@example.com");
    }
} 