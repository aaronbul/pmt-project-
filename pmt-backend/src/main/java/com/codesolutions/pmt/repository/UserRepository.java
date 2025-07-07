package com.codesolutions.pmt.repository;

import com.codesolutions.pmt.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Trouve un utilisateur par son nom d'utilisateur
     */
    Optional<User> findByUsername(String username);
    
    /**
     * Trouve un utilisateur par son email
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Vérifie si un nom d'utilisateur existe
     */
    boolean existsByUsername(String username);
    
    /**
     * Vérifie si un email existe
     */
    boolean existsByEmail(String email);
    
    /**
     * Trouve les utilisateurs par nom d'utilisateur (recherche partielle)
     */
    List<User> findByUsernameContainingIgnoreCase(String username);
    
    /**
     * Trouve les utilisateurs par email (recherche partielle)
     */
    List<User> findByEmailContainingIgnoreCase(String email);
    
    /**
     * Trouve les utilisateurs qui sont membres d'un projet spécifique
     */
    @Query("SELECT DISTINCT u FROM User u " +
           "JOIN u.projectMemberships pm " +
           "WHERE pm.project.id = :projectId")
    List<User> findUsersByProjectId(@Param("projectId") Long projectId);
    
    /**
     * Trouve les utilisateurs qui ont un rôle spécifique dans un projet
     */
    @Query("SELECT DISTINCT u FROM User u " +
           "JOIN u.projectMemberships pm " +
           "WHERE pm.project.id = :projectId AND pm.role.name = :roleName")
    List<User> findUsersByProjectIdAndRole(@Param("projectId") Long projectId, @Param("roleName") String roleName);
    
    /**
     * Trouve les utilisateurs qui ont des tâches assignées
     */
    @Query("SELECT DISTINCT u FROM User u " +
           "WHERE EXISTS (SELECT 1 FROM Task t WHERE t.assignedTo = u)")
    List<User> findUsersWithAssignedTasks();
    
    /**
     * Trouve les utilisateurs qui ont des tâches assignées dans un projet spécifique
     */
    @Query("SELECT DISTINCT u FROM User u " +
           "JOIN u.assignedTasks t " +
           "WHERE t.project.id = :projectId")
    List<User> findUsersWithAssignedTasksInProject(@Param("projectId") Long projectId);
} 