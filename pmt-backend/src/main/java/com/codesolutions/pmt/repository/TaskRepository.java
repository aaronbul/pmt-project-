package com.codesolutions.pmt.repository;

import com.codesolutions.pmt.entity.Task;
import com.codesolutions.pmt.entity.TaskStatus;
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
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    /**
     * Trouve les tâches par projet
     */
    List<Task> findByProjectId(Long projectId);
    
    /**
     * Trouve les tâches par projet avec pagination
     */
    Page<Task> findByProjectId(Long projectId, Pageable pageable);
    
    /**
     * Trouve les tâches assignées à un utilisateur
     */
    List<Task> findByAssignedTo(User assignedTo);
    
    /**
     * Trouve les tâches assignées à un utilisateur avec pagination
     */
    Page<Task> findByAssignedTo(User assignedTo, Pageable pageable);
    
    /**
     * Trouve les tâches créées par un utilisateur
     */
    List<Task> findByCreatedBy(User createdBy);
    
    /**
     * Trouve les tâches par statut
     */
    List<Task> findByStatus(TaskStatus status);
    
    /**
     * Trouve les tâches par statut dans un projet
     */
    List<Task> findByStatusAndProjectId(TaskStatus status, Long projectId);
    
    /**
     * Trouve les tâches par priorité
     */
    List<Task> findByPriority(Task.Priority priority);
    
    /**
     * Trouve les tâches par priorité dans un projet
     */
    List<Task> findByPriorityAndProjectId(Task.Priority priority, Long projectId);
    
    /**
     * Trouve les tâches avec une date d'échéance
     */
    List<Task> findByDueDateIsNotNull();
    
    /**
     * Trouve les tâches avec une date d'échéance dans un projet
     */
    List<Task> findByDueDateIsNotNullAndProjectId(Long projectId);
    
    /**
     * Trouve les tâches en retard (date d'échéance passée)
     */
    @Query("SELECT t FROM Task t WHERE t.dueDate < :today AND t.status.name NOT IN ('DONE', 'CANCELLED')")
    List<Task> findOverdueTasks(@Param("today") LocalDate today);
    
    /**
     * Trouve les tâches en retard pour un utilisateur spécifique
     */
    @Query("SELECT t FROM Task t WHERE t.dueDate < :today AND t.assignedTo.id = :userId AND t.status.name NOT IN ('DONE', 'CANCELLED')")
    List<Task> findOverdueTasksByUser(@Param("today") LocalDate today, @Param("userId") Long userId);
    
    /**
     * Trouve les tâches par titre (recherche partielle)
     */
    List<Task> findByTitleContainingIgnoreCase(String title);
    
    /**
     * Trouve les tâches par titre dans un projet (recherche partielle)
     */
    List<Task> findByTitleContainingIgnoreCaseAndProjectId(String title, Long projectId);
    
    /**
     * Trouve les tâches assignées à un utilisateur dans un projet
     */
    List<Task> findByAssignedToAndProjectId(User assignedTo, Long projectId);
    
    /**
     * Trouve les tâches créées par un utilisateur dans un projet
     */
    List<Task> findByCreatedByAndProjectId(User createdBy, Long projectId);
    
    /**
     * Trouve les tâches avec pagination par projet et statut
     */
    Page<Task> findByProjectIdAndStatus(Long projectId, TaskStatus status, Pageable pageable);
    
    /**
     * Trouve les tâches avec pagination par projet et priorité
     */
    Page<Task> findByProjectIdAndPriority(Long projectId, Task.Priority priority, Pageable pageable);
    
    /**
     * Compte les tâches par statut dans un projet
     */
    @Query("SELECT t.status.name, COUNT(t) FROM Task t WHERE t.project.id = :projectId GROUP BY t.status.name")
    List<Object[]> countTasksByStatusInProject(@Param("projectId") Long projectId);
    
    /**
     * Compte les tâches par priorité dans un projet
     */
    @Query("SELECT t.priority, COUNT(t) FROM Task t WHERE t.project.id = :projectId GROUP BY t.priority")
    List<Object[]> countTasksByPriorityInProject(@Param("projectId") Long projectId);
    
    /**
     * Trouve les tâches avec une date d'échéance proche (dans les 7 prochains jours)
     */
    @Query("SELECT t FROM Task t WHERE t.dueDate BETWEEN :today AND :nextWeek AND t.status.name NOT IN ('DONE', 'CANCELLED')")
    List<Task> findTasksDueSoon(@Param("today") LocalDate today, @Param("nextWeek") LocalDate nextWeek);

    /**
     * Récupérer les tâches assignées à un utilisateur
     */
    @Query("SELECT t FROM Task t WHERE t.assignedTo.id = :userId")
    List<Task> findByAssignedToId(@Param("userId") Long userId);

    /**
     * Récupérer les tâches créées par un utilisateur
     */
    @Query("SELECT t FROM Task t WHERE t.createdBy.id = :userId")
    List<Task> findByCreatedById(@Param("userId") Long userId);

    /**
     * Récupérer les tâches par projet et statut
     */
    @Query("SELECT t FROM Task t WHERE t.project.id = :projectId AND t.status = :status")
    List<Task> findByProjectIdAndStatus(@Param("projectId") Long projectId, @Param("status") TaskStatus status);

    /**
     * Récupérer les tâches en retard (dueDate < aujourd'hui et status != DONE)
     */
    @Query("SELECT t FROM Task t WHERE t.dueDate < CURRENT_DATE AND t.status.name != 'Terminé'")
    List<Task> findOverdueTasks();

    /**
     * Récupérer toutes les tâches avec leurs relations
     */
    @Query("SELECT DISTINCT t FROM Task t " +
           "LEFT JOIN FETCH t.project " +
           "LEFT JOIN FETCH t.assignedTo " +
           "LEFT JOIN FETCH t.createdBy " +
           "LEFT JOIN FETCH t.status")
    List<Task> findAllWithRelations();

    /**
     * Récupérer une tâche par ID avec ses relations
     */
    @Query("SELECT DISTINCT t FROM Task t " +
           "LEFT JOIN FETCH t.project " +
           "LEFT JOIN FETCH t.assignedTo " +
           "LEFT JOIN FETCH t.createdBy " +
           "LEFT JOIN FETCH t.status " +
           "WHERE t.id = :id")
    Task findByIdWithRelations(@Param("id") Long id);

    /**
     * Récupérer les tâches d'un projet avec leurs relations
     */
    @Query("SELECT DISTINCT t FROM Task t " +
           "LEFT JOIN FETCH t.project " +
           "LEFT JOIN FETCH t.assignedTo " +
           "LEFT JOIN FETCH t.createdBy " +
           "LEFT JOIN FETCH t.status " +
           "WHERE t.project.id = :projectId")
    List<Task> findByProjectIdWithRelations(@Param("projectId") Long projectId);
} 