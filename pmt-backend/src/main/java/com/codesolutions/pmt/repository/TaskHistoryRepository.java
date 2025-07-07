package com.codesolutions.pmt.repository;

import com.codesolutions.pmt.entity.TaskHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskHistoryRepository extends JpaRepository<TaskHistory, Long> {

    /**
     * Récupérer l'historique d'une tâche
     */
    List<TaskHistory> findByTaskId(Long taskId);

    /**
     * Récupérer l'historique d'un projet via la tâche
     */
    @Query("SELECT th FROM TaskHistory th WHERE th.task.project.id = :projectId")
    List<TaskHistory> findByProjectId(@Param("projectId") Long projectId);

    /**
     * Récupérer l'historique d'un utilisateur
     */
    List<TaskHistory> findByUserId(Long userId);

    /**
     * Récupérer l'historique par type d'action
     */
    List<TaskHistory> findByAction(String action);

    /**
     * Récupérer l'historique récent d'une tâche (limité)
     */
    @Query("SELECT th FROM TaskHistory th WHERE th.task.id = :taskId ORDER BY th.createdAt DESC")
    List<TaskHistory> findRecentByTaskId(@Param("taskId") Long taskId);

    /**
     * Récupérer l'historique par tâche et action
     */
    @Query("SELECT th FROM TaskHistory th WHERE th.task.id = :taskId AND th.action = :action")
    List<TaskHistory> findByTaskIdAndAction(@Param("taskId") Long taskId, @Param("action") String action);

    /**
     * Récupérer l'historique par projet et action
     */
    @Query("SELECT th FROM TaskHistory th WHERE th.task.project.id = :projectId AND th.action = :action")
    List<TaskHistory> findByProjectIdAndAction(@Param("projectId") Long projectId, @Param("action") String action);
} 