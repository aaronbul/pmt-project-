package com.codesolutions.pmt.repository;

import com.codesolutions.pmt.entity.Project;
import com.codesolutions.pmt.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    /**
     * Trouve les projets par nom (recherche partielle)
     */
    List<Project> findByNameContainingIgnoreCase(String name);
    
    /**
     * Trouve les projets créés par un utilisateur spécifique
     */
    List<Project> findByCreatedBy(User createdBy);
    
    /**
     * Trouve les projets créés par un utilisateur spécifique avec pagination
     */
    Page<Project> findByCreatedBy(User createdBy, Pageable pageable);
    
    /**
     * Trouve les projets créés après une date spécifique
     */
    List<Project> findByStartDateAfter(LocalDate startDate);
    
    /**
     * Trouve les projets créés avant une date spécifique
     */
    List<Project> findByStartDateBefore(LocalDate startDate);
    
    /**
     * Trouve les projets créés entre deux dates
     */
    List<Project> findByStartDateBetween(LocalDate startDate, LocalDate endDate);
    
    /**
     * Trouve les projets où un utilisateur est membre
     */
    @Query("SELECT DISTINCT p FROM Project p " +
           "JOIN p.members pm " +
           "WHERE pm.user.id = :userId")
    List<Project> findProjectsByUserId(@Param("userId") Long userId);
    
    /**
     * Trouve les projets où un utilisateur a un rôle spécifique
     */
    @Query("SELECT DISTINCT p FROM Project p " +
           "JOIN p.members pm " +
           "WHERE pm.user.id = :userId AND pm.role.name = :roleName")
    List<Project> findProjectsByUserIdAndRole(@Param("userId") Long userId, @Param("roleName") String roleName);
    
    /**
     * Trouve les projets avec le nombre de tâches
     */
    @Query("SELECT p, COUNT(t) as taskCount FROM Project p " +
           "LEFT JOIN p.tasks t " +
           "GROUP BY p " +
           "ORDER BY taskCount DESC")
    List<Object[]> findProjectsWithTaskCount();
    
    /**
     * Trouve les projets avec le nombre de membres
     */
    @Query("SELECT p, COUNT(pm) as memberCount FROM Project p " +
           "LEFT JOIN p.members pm " +
           "GROUP BY p " +
           "ORDER BY memberCount DESC")
    List<Object[]> findProjectsWithMemberCount();
    
    /**
     * Trouve les projets récents (créés dans les 30 derniers jours)
     */
    @Query("SELECT p FROM Project p " +
           "WHERE p.createdAt >= :thirtyDaysAgo " +
           "ORDER BY p.createdAt DESC")
    List<Project> findRecentProjects(@Param("thirtyDaysAgo") LocalDate thirtyDaysAgo);
    
    /**
     * Trouve les projets par nom avec pagination
     */
    Page<Project> findByNameContainingIgnoreCase(String name, Pageable pageable);
} 