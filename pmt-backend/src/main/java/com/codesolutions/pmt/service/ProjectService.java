package com.codesolutions.pmt.service;

import com.codesolutions.pmt.dto.ProjectDTO;
import com.codesolutions.pmt.dto.ProjectMemberDTO;
import com.codesolutions.pmt.entity.Project;
import com.codesolutions.pmt.entity.ProjectMember;
import com.codesolutions.pmt.entity.Role;
import com.codesolutions.pmt.entity.User;
import com.codesolutions.pmt.repository.ProjectRepository;
import com.codesolutions.pmt.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private RoleRepository roleRepository;
    
    /**
     * Crée un nouveau projet
     */
    public ProjectDTO createProject(ProjectDTO projectDto, Long createdById) {
        User createdBy = userService.findUserEntityById(createdById);
        
        Project project = new Project();
        project.setName(projectDto.getName());
        project.setDescription(projectDto.getDescription());
        project.setStartDate(projectDto.getStartDate());
        project.setCreatedBy(createdBy);
        
        Project savedProject = projectRepository.save(project);
        
        // Ajouter automatiquement le créateur comme admin du projet
        addMemberToProject(savedProject.getId(), createdById, "ADMIN");
        
        return convertToDto(savedProject);
    }
    
    /**
     * Trouve un projet par son ID
     */
    public ProjectDTO findById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'ID: " + id));
        return convertToDto(project);
    }
    
    /**
     * Trouve tous les projets
     */
    public List<ProjectDTO> findAll() {
        return projectRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Trouve les projets avec pagination
     */
    public Page<ProjectDTO> findAll(Pageable pageable) {
        return projectRepository.findAll(pageable)
                .map(this::convertToDto);
    }
    
    /**
     * Trouve les projets par nom (recherche partielle)
     */
    public List<ProjectDTO> findByNameContaining(String name) {
        return projectRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Trouve les projets créés par un utilisateur
     */
    public List<ProjectDTO> findByCreatedBy(Long userId) {
        User user = userService.findUserEntityById(userId);
        return projectRepository.findByCreatedBy(user).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Trouve les projets où un utilisateur est membre
     */
    public List<ProjectDTO> findProjectsByUserId(Long userId) {
        return projectRepository.findProjectsByUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Trouve les projets où un utilisateur a un rôle spécifique
     */
    public List<ProjectDTO> findProjectsByUserIdAndRole(Long userId, String roleName) {
        return projectRepository.findProjectsByUserIdAndRole(userId, roleName).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Trouve les projets récents (créés dans les 30 derniers jours)
     */
    public List<ProjectDTO> findRecentProjects() {
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        return projectRepository.findRecentProjects(thirtyDaysAgo).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Met à jour un projet
     */
    public ProjectDTO updateProject(Long id, ProjectDTO projectDto) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'ID: " + id));
        
        project.setName(projectDto.getName());
        project.setDescription(projectDto.getDescription());
        project.setStartDate(projectDto.getStartDate());
        
        Project updatedProject = projectRepository.save(project);
        return convertToDto(updatedProject);
    }
    
    /**
     * Supprime un projet
     */
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new RuntimeException("Projet non trouvé avec l'ID: " + id);
        }
        projectRepository.deleteById(id);
    }
    
    /**
     * Ajoute un membre à un projet
     */
    public ProjectMemberDTO addMemberToProject(Long projectId, Long userId, String roleName) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'ID: " + projectId));
        
        User user = userService.findUserEntityById(userId);
        
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Rôle non trouvé: " + roleName));
        
        // Vérifier si l'utilisateur est déjà membre du projet
        boolean isAlreadyMember = project.getMembers().stream()
                .anyMatch(member -> member.getUser().getId().equals(userId));
        
        if (isAlreadyMember) {
            throw new RuntimeException("L'utilisateur est déjà membre de ce projet");
        }
        
        ProjectMember projectMember = new ProjectMember(project, user, role);
        project.getMembers().add(projectMember);
        
        projectRepository.save(project);
        
        return convertToMemberDto(projectMember);
    }
    
    /**
     * Supprime un membre d'un projet
     */
    public void removeMemberFromProject(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'ID: " + projectId));
        
        boolean removed = project.getMembers().removeIf(member -> member.getUser().getId().equals(userId));
        
        if (!removed) {
            throw new RuntimeException("L'utilisateur n'est pas membre de ce projet");
        }
        
        projectRepository.save(project);
    }
    
    /**
     * Change le rôle d'un membre dans un projet
     */
    public ProjectMemberDTO changeMemberRole(Long projectId, Long userId, String newRoleName) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'ID: " + projectId));
        
        Role newRole = roleRepository.findByName(newRoleName)
                .orElseThrow(() -> new RuntimeException("Rôle non trouvé: " + newRoleName));
        
        ProjectMember member = project.getMembers().stream()
                .filter(m -> m.getUser().getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("L'utilisateur n'est pas membre de ce projet"));
        
        member.setRole(newRole);
        projectRepository.save(project);
        
        return convertToMemberDto(member);
    }
    
    /**
     * Convertit une entité Project en DTO
     */
    private ProjectDTO convertToDto(Project project) {
        ProjectDTO dto = new ProjectDTO(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getStartDate(),
                project.getCreatedBy().getId(),
                project.getCreatedBy().getUsername(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
        
        // Ajouter les statistiques
        dto.setTaskCount((long) project.getTasks().size());
        dto.setMemberCount((long) project.getMembers().size());
        
        // Ajouter les membres
        List<ProjectMemberDTO> memberDtos = project.getMembers().stream()
                .map(this::convertToMemberDto)
                .collect(Collectors.toList());
        dto.setMembers(memberDtos);
        
        return dto;
    }
    
    /**
     * Convertit une entité ProjectMember en DTO
     */
    private ProjectMemberDTO convertToMemberDto(ProjectMember member) {
        return new ProjectMemberDTO(
                member.getId(),
                member.getProject().getId(),
                member.getProject().getName(),
                member.getUser().getId(),
                member.getUser().getUsername(),
                member.getUser().getEmail(),
                member.getRole().getId(),
                member.getRole().getName(),
                member.getJoinedAt()
        );
    }
    
    /**
     * Trouve une entité Project par ID (pour les services internes)
     */
    public Project findProjectEntityById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'ID: " + id));
    }
} 