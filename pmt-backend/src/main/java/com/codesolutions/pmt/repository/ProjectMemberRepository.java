package com.codesolutions.pmt.repository;

import com.codesolutions.pmt.entity.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    /**
     * Récupérer tous les membres d'un projet avec les relations chargées
     */
    @Query("SELECT pm FROM ProjectMember pm " +
           "LEFT JOIN FETCH pm.user " +
           "LEFT JOIN FETCH pm.role " +
           "LEFT JOIN FETCH pm.project " +
           "WHERE pm.project.id = :projectId")
    List<ProjectMember> findByProjectIdWithRelations(@Param("projectId") Long projectId);

    /**
     * Récupérer tous les membres d'un projet
     */
    List<ProjectMember> findByProjectId(Long projectId);

    /**
     * Récupérer tous les projets d'un utilisateur avec les relations chargées
     */
    @Query("SELECT pm FROM ProjectMember pm " +
           "LEFT JOIN FETCH pm.user " +
           "LEFT JOIN FETCH pm.role " +
           "LEFT JOIN FETCH pm.project " +
           "WHERE pm.user.id = :userId")
    List<ProjectMember> findByUserIdWithRelations(@Param("userId") Long userId);

    /**
     * Récupérer tous les projets d'un utilisateur
     */
    List<ProjectMember> findByUserId(Long userId);

    /**
     * Récupérer les membres par rôle avec les relations chargées
     */
    @Query("SELECT pm FROM ProjectMember pm " +
           "LEFT JOIN FETCH pm.user " +
           "LEFT JOIN FETCH pm.role " +
           "LEFT JOIN FETCH pm.project " +
           "WHERE pm.role.id = :roleId")
    List<ProjectMember> findByRoleIdWithRelations(@Param("roleId") Integer roleId);

    /**
     * Récupérer les membres par rôle
     */
    List<ProjectMember> findByRoleId(Integer roleId);

    /**
     * Vérifier si un utilisateur est membre d'un projet
     */
    Optional<ProjectMember> findByProjectIdAndUserId(Long projectId, Long userId);

    /**
     * Compter le nombre de membres d'un projet
     */
    long countByProjectId(Long projectId);

    /**
     * Récupérer les membres par projet et rôle
     */
    @Query("SELECT pm FROM ProjectMember pm WHERE pm.project.id = :projectId AND pm.role.id = :roleId")
    List<ProjectMember> findByProjectIdAndRoleId(@Param("projectId") Long projectId, @Param("roleId") Integer roleId);

    /**
     * Récupérer les projets où un utilisateur a un rôle spécifique
     */
    @Query("SELECT pm FROM ProjectMember pm WHERE pm.user.id = :userId AND pm.role.name = :roleName")
    List<ProjectMember> findByUserIdAndRoleName(@Param("userId") Long userId, @Param("roleName") String roleName);
} 