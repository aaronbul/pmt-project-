package com.codesolutions.pmt.controller;

import com.codesolutions.pmt.dto.ProjectDTO;
import com.codesolutions.pmt.dto.ProjectMemberDTO;
import com.codesolutions.pmt.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:4200")
public class ProjectController {
    
    @Autowired
    private ProjectService projectService;
    
    /**
     * POST /projects - Créer un nouveau projet
     */
    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody ProjectDTO projectDto,
                                                    @RequestParam Long createdById) {
        try {
            ProjectDTO createdProject = projectService.createProject(projectDto, createdById);
            return new ResponseEntity<>(createdProject, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * GET /projects - Récupérer tous les projets
     */
    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        List<ProjectDTO> projects = projectService.findAll();
        return ResponseEntity.ok(projects);
    }
    
    /**
     * GET /projects/paged - Récupérer tous les projets avec pagination
     */
    @GetMapping("/paged")
    public ResponseEntity<Page<ProjectDTO>> getAllProjectsPaged(Pageable pageable) {
        Page<ProjectDTO> projects = projectService.findAll(pageable);
        return ResponseEntity.ok(projects);
    }
    
    /**
     * GET /projects/{id} - Récupérer un projet par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        try {
            ProjectDTO project = projectService.findById(id);
            return ResponseEntity.ok(project);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    /**
     * GET /projects/search?name={name} - Rechercher des projets par nom
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProjectDTO>> searchProjectsByName(@RequestParam String name) {
        List<ProjectDTO> projects = projectService.findByNameContaining(name);
        return ResponseEntity.ok(projects);
    }
    
    /**
     * GET /projects/created-by/{userId} - Récupérer les projets créés par un utilisateur
     */
    @GetMapping("/created-by/{userId}")
    public ResponseEntity<List<ProjectDTO>> getProjectsByCreatedBy(@PathVariable Long userId) {
        List<ProjectDTO> projects = projectService.findByCreatedBy(userId);
        return ResponseEntity.ok(projects);
    }
    
    /**
     * GET /projects/user/{userId} - Récupérer les projets où un utilisateur est membre
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProjectDTO>> getProjectsByUserId(@PathVariable Long userId) {
        List<ProjectDTO> projects = projectService.findProjectsByUserId(userId);
        return ResponseEntity.ok(projects);
    }
    
    /**
     * GET /projects/user/{userId}/role/{roleName} - Récupérer les projets où un utilisateur a un rôle spécifique
     */
    @GetMapping("/user/{userId}/role/{roleName}")
    public ResponseEntity<List<ProjectDTO>> getProjectsByUserIdAndRole(
            @PathVariable Long userId, 
            @PathVariable String roleName) {
        List<ProjectDTO> projects = projectService.findProjectsByUserIdAndRole(userId, roleName);
        return ResponseEntity.ok(projects);
    }
    
    /**
     * GET /projects/recent - Récupérer les projets récents
     */
    @GetMapping("/recent")
    public ResponseEntity<List<ProjectDTO>> getRecentProjects() {
        List<ProjectDTO> projects = projectService.findRecentProjects();
        return ResponseEntity.ok(projects);
    }
    
    /**
     * PUT /projects/{id} - Mettre à jour un projet
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long id, @Valid @RequestBody ProjectDTO projectDto) {
        try {
            ProjectDTO updatedProject = projectService.updateProject(id, projectDto);
            return ResponseEntity.ok(updatedProject);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * DELETE /projects/{id} - Supprimer un projet
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        try {
            projectService.deleteProject(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    /**
     * POST /projects/{projectId}/members - Ajouter un membre à un projet
     */
    @PostMapping("/{projectId}/members")
    public ResponseEntity<ProjectMemberDTO> addMemberToProject(
            @PathVariable Long projectId,
            @RequestBody AddMemberRequest request) {
        try {
            ProjectMemberDTO member = projectService.addMemberToProject(projectId, request.getUserId(), request.getRoleName());
            return new ResponseEntity<>(member, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * DELETE /projects/{projectId}/members/{userId} - Supprimer un membre d'un projet
     */
    @DeleteMapping("/{projectId}/members/{userId}")
    public ResponseEntity<Void> removeMemberFromProject(@PathVariable Long projectId, @PathVariable Long userId) {
        try {
            projectService.removeMemberFromProject(projectId, userId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * PUT /projects/{projectId}/members/{userId}/role - Changer le rôle d'un membre
     */
    @PutMapping("/{projectId}/members/{userId}/role")
    public ResponseEntity<ProjectMemberDTO> changeMemberRole(
            @PathVariable Long projectId,
            @PathVariable Long userId,
            @RequestBody ChangeRoleRequest request) {
        try {
            ProjectMemberDTO member = projectService.changeMemberRole(projectId, userId, request.getRoleName());
            return ResponseEntity.ok(member);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * Classe interne pour la requête d'ajout de membre
     */
    public static class AddMemberRequest {
        private Long userId;
        private String roleName;
        
        // Constructeurs
        public AddMemberRequest() {}
        
        public AddMemberRequest(Long userId, String roleName) {
            this.userId = userId;
            this.roleName = roleName;
        }
        
        // Getters et Setters
        public Long getUserId() {
            return userId;
        }
        
        public void setUserId(Long userId) {
            this.userId = userId;
        }
        
        public String getRoleName() {
            return roleName;
        }
        
        public void setRoleName(String roleName) {
            this.roleName = roleName;
        }
    }
    
    /**
     * Classe interne pour la requête de changement de rôle
     */
    public static class ChangeRoleRequest {
        private String roleName;
        
        // Constructeurs
        public ChangeRoleRequest() {}
        
        public ChangeRoleRequest(String roleName) {
            this.roleName = roleName;
        }
        
        // Getters et Setters
        public String getRoleName() {
            return roleName;
        }
        
        public void setRoleName(String roleName) {
            this.roleName = roleName;
        }
    }
} 