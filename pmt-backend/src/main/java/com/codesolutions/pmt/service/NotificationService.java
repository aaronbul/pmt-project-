package com.codesolutions.pmt.service;

import com.codesolutions.pmt.dto.NotificationCreateDTO;
import com.codesolutions.pmt.entity.Notification;
import com.codesolutions.pmt.entity.User;
import com.codesolutions.pmt.entity.Project;
import com.codesolutions.pmt.entity.Task;
import com.codesolutions.pmt.repository.NotificationRepository;
import com.codesolutions.pmt.repository.UserRepository;
import com.codesolutions.pmt.repository.ProjectRepository;
import com.codesolutions.pmt.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    /**
     * Récupérer toutes les notifications
     */
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    /**
     * Récupérer une notification par son ID
     */
    public Notification getNotificationById(Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée avec l'ID: " + id));
    }

    /**
     * Récupérer les notifications d'un utilisateur
     */
    public List<Notification> getNotificationsByUser(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    /**
     * Récupérer les notifications non lues d'un utilisateur
     */
    public List<Notification> getUnreadNotificationsByUser(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(userId);
    }

    /**
     * Récupérer les notifications d'un projet
     */
    public List<Notification> getNotificationsByProject(Long projectId) {
        return notificationRepository.findByRelatedEntityTypeAndRelatedEntityId("PROJECT", projectId);
    }

    /**
     * Récupérer les notifications d'une tâche
     */
    public List<Notification> getNotificationsByTask(Long taskId) {
        return notificationRepository.findByRelatedEntityTypeAndRelatedEntityId("TASK", taskId);
    }

    /**
     * Créer une nouvelle notification
     */
    public Notification createNotification(NotificationCreateDTO notificationCreateDTO) {
        // Récupérer l'utilisateur
        User user = null;
        if (notificationCreateDTO.getUserId() != null) {
            user = userRepository.findById(notificationCreateDTO.getUserId())
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID: " + notificationCreateDTO.getUserId()));
        }

        // Déterminer le type d'entité liée
        String relatedEntityType = null;
        Long relatedEntityId = null;
        
        if (notificationCreateDTO.getTaskId() != null) {
            relatedEntityType = "TASK";
            relatedEntityId = notificationCreateDTO.getTaskId();
        } else if (notificationCreateDTO.getProjectId() != null) {
            relatedEntityType = "PROJECT";
            relatedEntityId = notificationCreateDTO.getProjectId();
        }

        // Créer la notification
        Notification notification = new Notification(user, notificationCreateDTO.getTitle(), 
                                                   notificationCreateDTO.getMessage(), notificationCreateDTO.getType(),
                                                   relatedEntityType, relatedEntityId);

        return notificationRepository.save(notification);
    }

    /**
     * Marquer une notification comme lue
     */
    public Notification markAsRead(Long id) {
        Notification notification = getNotificationById(id);
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }

    /**
     * Marquer toutes les notifications d'un utilisateur comme lues
     */
    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = getUnreadNotificationsByUser(userId);
        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
        }
        notificationRepository.saveAll(unreadNotifications);
    }

    /**
     * Supprimer une notification
     */
    public void deleteNotification(Long id) {
        Notification notification = getNotificationById(id);
        notificationRepository.delete(notification);
    }

    /**
     * Supprimer toutes les notifications d'un utilisateur
     */
    public void deleteAllNotificationsByUser(Long userId) {
        List<Notification> notifications = getNotificationsByUser(userId);
        notificationRepository.deleteAll(notifications);
    }

    /**
     * Compter les notifications non lues d'un utilisateur
     */
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    /**
     * Créer une notification de tâche assignée
     */
    public Notification createTaskAssignedNotification(Long userId, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tâche non trouvée avec l'ID: " + taskId));
        
        NotificationCreateDTO dto = new NotificationCreateDTO();
        dto.setTitle("Nouvelle tâche assignée");
        dto.setMessage("Vous avez été assigné à la tâche : " + task.getTitle());
        dto.setType("TASK_ASSIGNED");
        dto.setUserId(userId);
        dto.setTaskId(taskId);
        dto.setProjectId(task.getProject().getId());
        
        return createNotification(dto);
    }

    /**
     * Créer une notification de statut de tâche modifié
     */
    public Notification createTaskStatusChangedNotification(Long userId, Long taskId, String newStatus) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tâche non trouvée avec l'ID: " + taskId));
        
        NotificationCreateDTO dto = new NotificationCreateDTO();
        dto.setTitle("Statut de tâche modifié");
        dto.setMessage("Le statut de la tâche '" + task.getTitle() + "' a été modifié vers : " + newStatus);
        dto.setType("TASK_STATUS_CHANGED");
        dto.setUserId(userId);
        dto.setTaskId(taskId);
        dto.setProjectId(task.getProject().getId());
        
        return createNotification(dto);
    }

    /**
     * Créer une notification de nouveau membre de projet
     */
    public Notification createProjectMemberAddedNotification(Long userId, Long projectId, String projectName) {
        NotificationCreateDTO dto = new NotificationCreateDTO();
        dto.setTitle("Nouveau membre de projet");
        dto.setMessage("Vous avez été ajouté au projet : " + projectName);
        dto.setType("PROJECT_MEMBER_ADDED");
        dto.setUserId(userId);
        dto.setProjectId(projectId);
        
        return createNotification(dto);
    }
} 