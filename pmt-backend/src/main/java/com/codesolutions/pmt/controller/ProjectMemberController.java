package com.codesolutions.pmt.controller;

import com.codesolutions.pmt.dto.ProjectMemberDTO;
import com.codesolutions.pmt.dto.ProjectMemberCreateDTO;
import com.codesolutions.pmt.entity.ProjectMember;
import com.codesolutions.pmt.service.ProjectMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/project-members")
@CrossOrigin(origins = "http://localhost:4200")
public class ProjectMemberController {

    @Autowired
    private ProjectMemberService projectMemberService;

    /**
     * Récupérer tous les membres de projet
     */
    @GetMapping
    public ResponseEntity<List<ProjectMemberDTO>> getAllProjectMembers() {
        List<ProjectMember> members = projectMemberService.getAllProjectMembers();
        List<ProjectMemberDTO> memberDTOs = members.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(memberDTOs);
    }

    /**
     * Récupérer un membre de projet par son ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProjectMemberDTO> getProjectMemberById(@PathVariable Long id) {
        try {
            ProjectMember member = projectMemberService.getProjectMemberById(id);
            return ResponseEntity.ok(convertToDTO(member));
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().toLowerCase().contains("non trouvé")) {
                return ResponseEntity.notFound().build();
            }
            throw e;
        }
    }

    /**
     * Récupérer tous les membres d'un projet
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ProjectMemberDTO>> getMembersByProject(@PathVariable Long projectId) {
        List<ProjectMember> members = projectMemberService.getMembersByProject(projectId);
        List<ProjectMemberDTO> memberDTOs = members.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(memberDTOs);
    }

    /**
     * Récupérer tous les projets d'un utilisateur
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProjectMemberDTO>> getProjectsByUser(@PathVariable Long userId) {
        List<ProjectMember> members = projectMemberService.getProjectsByUser(userId);
        List<ProjectMemberDTO> memberDTOs = members.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(memberDTOs);
    }

    /**
     * Récupérer les membres par rôle
     */
    @GetMapping("/role/{roleId}")
    public ResponseEntity<List<ProjectMemberDTO>> getMembersByRole(@PathVariable Integer roleId) {
        List<ProjectMember> members = projectMemberService.getMembersByRole(roleId);
        List<ProjectMemberDTO> memberDTOs = members.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(memberDTOs);
    }

    /**
     * Ajouter un membre à un projet
     */
    @PostMapping
    public ResponseEntity<ProjectMemberDTO> addProjectMember(@RequestBody ProjectMemberCreateDTO memberCreateDTO) {
        ProjectMember createdMember = projectMemberService.addProjectMember(memberCreateDTO);
        return ResponseEntity.ok(convertToDTO(createdMember));
    }

    /**
     * Mettre à jour le rôle d'un membre
     */
    @PutMapping("/{id}/role/{roleId}")
    public ResponseEntity<ProjectMemberDTO> updateMemberRole(@PathVariable Long id, @PathVariable Integer roleId) {
        ProjectMember updatedMember = projectMemberService.updateMemberRole(id, roleId);
        return ResponseEntity.ok(convertToDTO(updatedMember));
    }

    /**
     * Supprimer un membre d'un projet
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeProjectMember(@PathVariable Long id) {
        projectMemberService.removeProjectMember(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Vérifier si un utilisateur est membre d'un projet
     */
    @GetMapping("/check/{projectId}/{userId}")
    public ResponseEntity<ProjectMemberDTO> checkProjectMembership(@PathVariable Long projectId, @PathVariable Long userId) {
        ProjectMember member = projectMemberService.getProjectMembership(projectId, userId);
        if (member != null) {
            return ResponseEntity.ok(convertToDTO(member));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint de test pour diagnostiquer les problèmes de rôles
     */
    @GetMapping("/test/{projectId}")
    public ResponseEntity<String> testProjectMembers(@PathVariable Long projectId) {
        List<ProjectMember> members = projectMemberService.getMembersByProject(projectId);
        StringBuilder result = new StringBuilder();
        result.append("Test des membres du projet ").append(projectId).append("\n");
        result.append("Nombre de membres: ").append(members.size()).append("\n\n");
        
        members.forEach(member -> {
            result.append("Membre ID: ").append(member.getId()).append("\n");
            result.append("  - Utilisateur: ").append(member.getUser() != null ? member.getUser().getUsername() : "NULL").append("\n");
            result.append("  - Rôle: ").append(member.getRole() != null ? member.getRole().getName() : "NULL").append("\n");
            result.append("  - RoleId: ").append(member.getRole() != null ? member.getRole().getId() : "NULL").append("\n");
            result.append("  - Date: ").append(member.getJoinedAt()).append("\n\n");
        });
        
        return ResponseEntity.ok(result.toString());
    }

    /**
     * Conversion ProjectMember vers ProjectMemberDTO
     */
    private ProjectMemberDTO convertToDTO(ProjectMember member) {
        ProjectMemberDTO dto = new ProjectMemberDTO();
        dto.setId(member.getId());
        dto.setJoinedAt(member.getJoinedAt());
        
        if (member.getProject() != null) {
            dto.setProjectId(member.getProject().getId());
            dto.setProjectName(member.getProject().getName());
        }
        
        if (member.getUser() != null) {
            dto.setUserId(member.getUser().getId());
            dto.setUsername(member.getUser().getUsername());
            dto.setEmail(member.getUser().getEmail());
        }
        
        if (member.getRole() != null) {
            dto.setRoleId(member.getRole().getId());
            dto.setRoleName(member.getRole().getName());
        }
        
        return dto;
    }
} 