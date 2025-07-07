package com.codesolutions.pmt.controller;

import com.codesolutions.pmt.dto.UserDTO;
import com.codesolutions.pmt.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    /**
     * POST /users - Créer un nouvel utilisateur
     */
    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody UserDTO userDto) {
        try {
            UserDTO createdUser = userService.createUser(userDto);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * POST /users/login - Authentification
     */
    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody LoginRequest loginRequest) {
        try {
            UserDTO user = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
    
    /**
     * GET /users - Récupérer tous les utilisateurs
     */
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.findAll();
        return ResponseEntity.ok(users);
    }
    
    /**
     * GET /users/{id} - Récupérer un utilisateur par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        try {
            UserDTO user = userService.findById(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    /**
     * GET /users/username/{username} - Récupérer un utilisateur par nom d'utilisateur
     */
    @GetMapping("/username/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        try {
            UserDTO user = userService.findByUsername(username);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    /**
     * GET /users/email/{email} - Récupérer un utilisateur par email
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<UserDTO> getUserByEmail(@PathVariable String email) {
        try {
            UserDTO user = userService.findByEmail(email);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    /**
     * GET /users/search/username?q={query} - Rechercher des utilisateurs par nom d'utilisateur
     */
    @GetMapping("/search/username")
    public ResponseEntity<List<UserDTO>> searchUsersByUsername(@RequestParam String q) {
        List<UserDTO> users = userService.findByUsernameContaining(q);
        return ResponseEntity.ok(users);
    }
    
    /**
     * GET /users/search/email?q={query} - Rechercher des utilisateurs par email
     */
    @GetMapping("/search/email")
    public ResponseEntity<List<UserDTO>> searchUsersByEmail(@RequestParam String q) {
        List<UserDTO> users = userService.findByEmailContaining(q);
        return ResponseEntity.ok(users);
    }
    
    /**
     * GET /users/project/{projectId} - Récupérer les utilisateurs d'un projet
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<UserDTO>> getUsersByProjectId(@PathVariable Long projectId) {
        List<UserDTO> users = userService.findUsersByProjectId(projectId);
        return ResponseEntity.ok(users);
    }
    
    /**
     * GET /users/project/{projectId}/role/{roleName} - Récupérer les utilisateurs d'un projet avec un rôle spécifique
     */
    @GetMapping("/project/{projectId}/role/{roleName}")
    public ResponseEntity<List<UserDTO>> getUsersByProjectIdAndRole(
            @PathVariable Long projectId, 
            @PathVariable String roleName) {
        List<UserDTO> users = userService.findUsersByProjectIdAndRole(projectId, roleName);
        return ResponseEntity.ok(users);
    }
    
    /**
     * GET /users/assigned-tasks - Récupérer les utilisateurs avec des tâches assignées
     */
    @GetMapping("/assigned-tasks")
    public ResponseEntity<List<UserDTO>> getUsersWithAssignedTasks() {
        List<UserDTO> users = userService.findUsersWithAssignedTasks();
        return ResponseEntity.ok(users);
    }
    
    /**
     * PUT /users/{id} - Mettre à jour un utilisateur
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @Valid @RequestBody UserDTO userDto) {
        try {
            UserDTO updatedUser = userService.updateUser(id, userDto);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * DELETE /users/{id} - Supprimer un utilisateur
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    /**
     * Classe interne pour la requête de connexion
     */
    public static class LoginRequest {
        private String email;
        private String password;
        
        // Constructeurs
        public LoginRequest() {}
        
        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }
        
        // Getters et Setters
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getPassword() {
            return password;
        }
        
        public void setPassword(String password) {
            this.password = password;
        }
    }
} 