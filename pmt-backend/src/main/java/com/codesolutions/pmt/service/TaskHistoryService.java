package com.codesolutions.pmt.service;

import com.codesolutions.pmt.entity.TaskHistory;
import com.codesolutions.pmt.entity.Task;
import com.codesolutions.pmt.entity.User;
import com.codesolutions.pmt.entity.Project;
import com.codesolutions.pmt.repository.TaskHistoryRepository;
import com.codesolutions.pmt.repository.TaskRepository;
import com.codesolutions.pmt.repository.UserRepository;
import com.codesolutions.pmt.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TaskHistoryService {

    @Autowired
    private TaskHistoryRepository taskHistoryRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    /**
     * Récupérer tout l'historique des tâches
     */
    public List<TaskHistory> getAllTaskHistory() {
        return taskHistoryRepository.findAll();
    }

    /**
     * Récupérer un historique par son ID
     */
    public TaskHistory getTaskHistoryById(Long id) {
        return taskHistoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Historique non trouvé avec l'ID: " + id));
    }

    /**
     * Récupérer l'historique d'une tâche
     */
    public List<TaskHistory> getTaskHistoryByTask(Long taskId) {
        return taskHistoryRepository.findByTaskId(taskId);
    }

    /**
     * Récupérer l'historique d'un projet
     */
    public List<TaskHistory> getTaskHistoryByProject(Long projectId) {
        return taskHistoryRepository.findByProjectId(projectId);
    }

    /**
     * Récupérer l'historique d'un utilisateur
     */
    public List<TaskHistory> getTaskHistoryByUser(Long userId) {
        return taskHistoryRepository.findByUserId(userId);
    }

    /**
     * Récupérer l'historique par type d'action
     */
    public List<TaskHistory> getTaskHistoryByAction(String action) {
        return taskHistoryRepository.findByAction(action);
    }

    /**
     * Récupérer l'historique récent d'une tâche (limité)
     */
    public List<TaskHistory> getRecentTaskHistory(Long taskId) {
        return taskHistoryRepository.findRecentByTaskId(taskId);
    }

    /**
     * Créer un nouvel historique
     */
    public TaskHistory createTaskHistory(String action, String oldValue, String newValue, 
                                       Long taskId, Long userId) {
        // Récupérer la tâche
        Task task = null;
        if (taskId != null) {
            task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new RuntimeException("Tâche non trouvée avec l'ID: " + taskId));
        }

        // Récupérer l'utilisateur
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID: " + userId));
        }

        // Créer l'historique
        TaskHistory history = new TaskHistory(task, user, action, oldValue, newValue);
        return taskHistoryRepository.save(history);
    }

    /**
     * Supprimer un historique
     */
    public void deleteTaskHistory(Long id) {
        TaskHistory history = getTaskHistoryById(id);
        taskHistoryRepository.delete(history);
    }

    /**
     * Supprimer tout l'historique d'une tâche
     */
    public void deleteTaskHistoryByTask(Long taskId) {
        List<TaskHistory> history = getTaskHistoryByTask(taskId);
        taskHistoryRepository.deleteAll(history);
    }

    /**
     * Créer un historique de création de tâche
     */
    public TaskHistory createTaskCreatedHistory(Long taskId, Long userId) {
        return createTaskHistory("CREATED", null, "Nouvelle tâche créée", taskId, userId);
    }

    /**
     * Créer un historique de modification de statut
     */
    public TaskHistory createStatusChangedHistory(Long taskId, Long userId, String oldStatus, String newStatus) {
        return createTaskHistory("STATUS_CHANGED", oldStatus, newStatus, taskId, userId);
    }

    /**
     * Créer un historique d'assignation de tâche
     */
    public TaskHistory createTaskAssignedHistory(Long taskId, Long userId, String oldAssignee, String newAssignee) {
        return createTaskHistory("ASSIGNED", oldAssignee, newAssignee, taskId, userId);
    }

    /**
     * Créer un historique de modification de priorité
     */
    public TaskHistory createPriorityChangedHistory(Long taskId, Long userId, String oldPriority, String newPriority) {
        return createTaskHistory("PRIORITY_CHANGED", oldPriority, newPriority, taskId, userId);
    }

    /**
     * Créer un historique de modification de description
     */
    public TaskHistory createDescriptionChangedHistory(Long taskId, Long userId, String oldDescription, String newDescription) {
        return createTaskHistory("DESCRIPTION_CHANGED", oldDescription, newDescription, taskId, userId);
    }

    /**
     * Créer un historique de suppression de tâche
     */
    public TaskHistory createTaskDeletedHistory(Long taskId, Long userId, String taskTitle) {
        return createTaskHistory("DELETED", taskTitle, "Tâche supprimée", taskId, userId);
    }
} 