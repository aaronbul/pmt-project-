package com.codesolutions.pmt.service;

import com.codesolutions.pmt.dto.ProjectMemberCreateDTO;
import com.codesolutions.pmt.entity.ProjectMember;
import com.codesolutions.pmt.entity.Project;
import com.codesolutions.pmt.entity.User;
import com.codesolutions.pmt.entity.Role;
import com.codesolutions.pmt.repository.ProjectMemberRepository;
import com.codesolutions.pmt.repository.ProjectRepository;
import com.codesolutions.pmt.repository.UserRepository;
import com.codesolutions.pmt.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProjectMemberService {

    @Autowired
    private ProjectMemberRepository projectMemberRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    /**
     * Récupérer tous les membres de projet
     */
    public List<ProjectMember> getAllProjectMembers() {
        return projectMemberRepository.findAll();
    }

    /**
     * Récupérer un membre de projet par son ID
     */
    public ProjectMember getProjectMemberById(Long id) {
        return projectMemberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Membre de projet non trouvé avec l'ID: " + id));
    }

    /**
     * Récupérer tous les membres d'un projet
     */
    public List<ProjectMember> getMembersByProject(Long projectId) {
        List<ProjectMember> members = projectMemberRepository.findByProjectIdWithRelations(projectId);
        System.out.println("ProjectMemberService.getMembersByProject(" + projectId + ") - Nombre de membres trouvés: " + members.size());
        members.forEach(member -> {
            System.out.println("  - Membre: " + member.getUser().getUsername() + 
                             " (Rôle: " + (member.getRole() != null ? member.getRole().getName() : "NULL") + 
                             ", RoleId: " + (member.getRole() != null ? member.getRole().getId() : "NULL") + ")");
        });
        return members;
    }

    /**
     * Récupérer tous les projets d'un utilisateur
     */
    public List<ProjectMember> getProjectsByUser(Long userId) {
        return projectMemberRepository.findByUserIdWithRelations(userId);
    }

    /**
     * Récupérer les membres par rôle
     */
    public List<ProjectMember> getMembersByRole(Integer roleId) {
        return projectMemberRepository.findByRoleIdWithRelations(roleId);
    }

    /**
     * Ajouter un membre à un projet
     */
    public ProjectMember addProjectMember(ProjectMemberCreateDTO memberCreateDTO) {
        // Vérifier si le membre existe déjà dans le projet
        Optional<ProjectMember> existingMember = projectMemberRepository
                .findByProjectIdAndUserId(memberCreateDTO.getProjectId(), memberCreateDTO.getUserId());
        
        if (existingMember.isPresent()) {
            throw new RuntimeException("L'utilisateur est déjà membre de ce projet");
        }

        ProjectMember member = new ProjectMember();
        member.setJoinedAt(LocalDateTime.now());

        // Associer le projet
        Project project = projectRepository.findById(memberCreateDTO.getProjectId())
                .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'ID: " + memberCreateDTO.getProjectId()));
        member.setProject(project);

        // Associer l'utilisateur
        User user = userRepository.findById(memberCreateDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID: " + memberCreateDTO.getUserId()));
        member.setUser(user);

        // Associer le rôle
        if (memberCreateDTO.getRoleId() != null) {
            Role role = roleRepository.findById(memberCreateDTO.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Rôle non trouvé avec l'ID: " + memberCreateDTO.getRoleId()));
            member.setRole(role);
        } else {
            // Rôle par défaut (membre)
            Role defaultRole = roleRepository.findByName("MEMBER")
                    .orElseThrow(() -> new RuntimeException("Rôle par défaut 'MEMBER' non trouvé"));
            member.setRole(defaultRole);
        }

        return projectMemberRepository.save(member);
    }

    /**
     * Mettre à jour le rôle d'un membre
     */
    public ProjectMember updateMemberRole(Long memberId, Integer roleId) {
        ProjectMember member = getProjectMemberById(memberId);
        
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Rôle non trouvé avec l'ID: " + roleId));
        
        member.setRole(role);
        return projectMemberRepository.save(member);
    }

    /**
     * Supprimer un membre d'un projet
     */
    public void removeProjectMember(Long id) {
        ProjectMember member = getProjectMemberById(id);
        projectMemberRepository.delete(member);
    }

    /**
     * Vérifier si un utilisateur est membre d'un projet
     */
    public ProjectMember getProjectMembership(Long projectId, Long userId) {
        return projectMemberRepository.findByProjectIdAndUserId(projectId, userId)
                .orElse(null);
    }

    /**
     * Vérifier si un utilisateur a un rôle spécifique dans un projet
     */
    public boolean hasRoleInProject(Long projectId, Long userId, String roleName) {
        Optional<ProjectMember> member = projectMemberRepository.findByProjectIdAndUserId(projectId, userId);
        return member.isPresent() && member.get().getRole().getName().equals(roleName);
    }

    /**
     * Récupérer le nombre de membres d'un projet
     */
    public long getProjectMemberCount(Long projectId) {
        return projectMemberRepository.countByProjectId(projectId);
    }
} 