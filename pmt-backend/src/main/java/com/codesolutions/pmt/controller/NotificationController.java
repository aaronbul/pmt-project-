package com.codesolutions.pmt.controller;

import com.codesolutions.pmt.dto.NotificationDTO;
import com.codesolutions.pmt.dto.NotificationCreateDTO;
import com.codesolutions.pmt.entity.Notification;
import com.codesolutions.pmt.entity.Project;
import com.codesolutions.pmt.entity.Task;
import com.codesolutions.pmt.service.NotificationService;
import com.codesolutions.pmt.repository.ProjectRepository;
import com.codesolutions.pmt.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:4200")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    /**
     * Récupérer toutes les notifications
     */
    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getAllNotifications() {
        List<Notification> notifications = notificationService.getAllNotifications();
        List<NotificationDTO> notificationDTOs = notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(notificationDTOs);
    }

    /**
     * Récupérer une notification par son ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<NotificationDTO> getNotificationById(@PathVariable Long id) {
        Notification notification = notificationService.getNotificationById(id);
        return ResponseEntity.ok(convertToDTO(notification));
    }

    /**
     * Récupérer les notifications d'un utilisateur
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByUser(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.getNotificationsByUser(userId);
        List<NotificationDTO> notificationDTOs = notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(notificationDTOs);
    }

    /**
     * Récupérer les notifications non lues d'un utilisateur
     */
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotificationsByUser(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.getUnreadNotificationsByUser(userId);
        List<NotificationDTO> notificationDTOs = notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(notificationDTOs);
    }

    /**
     * Récupérer les notifications d'un projet
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByProject(@PathVariable Long projectId) {
        List<Notification> notifications = notificationService.getNotificationsByProject(projectId);
        List<NotificationDTO> notificationDTOs = notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(notificationDTOs);
    }

    /**
     * Créer une nouvelle notification
     */
    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(@RequestBody NotificationCreateDTO notificationCreateDTO) {
        Notification createdNotification = notificationService.createNotification(notificationCreateDTO);
        return ResponseEntity.ok(convertToDTO(createdNotification));
    }

    /**
     * Marquer une notification comme lue
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationDTO> markAsRead(@PathVariable Long id) {
        Notification notification = notificationService.markAsRead(id);
        return ResponseEntity.ok(convertToDTO(notification));
    }

    /**
     * Marquer toutes les notifications d'un utilisateur comme lues
     */
    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<Void> markAllAsRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    /**
     * Supprimer une notification
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Supprimer toutes les notifications d'un utilisateur
     */
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteAllNotificationsByUser(@PathVariable Long userId) {
        notificationService.deleteAllNotificationsByUser(userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Compter les notifications non lues d'un utilisateur
     */
    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable Long userId) {
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(count);
    }

    /**
     * Conversion Notification vers NotificationDTO
     */
    private NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType());
        dto.setRead(notification.getIsRead());
        dto.setCreatedAt(notification.getCreatedAt());
        
        if (notification.getUser() != null) {
            dto.setUserId(notification.getUser().getId());
            dto.setUsername(notification.getUser().getUsername());
        }
        
        // Récupérer les informations du projet ou de la tâche via relatedEntityType et relatedEntityId
        if ("PROJECT".equals(notification.getRelatedEntityType()) && notification.getRelatedEntityId() != null) {
            try {
                Project project = projectRepository.findById(notification.getRelatedEntityId()).orElse(null);
                if (project != null) {
                    dto.setProjectId(project.getId());
                    dto.setProjectName(project.getName());
                }
            } catch (Exception e) {
                // Ignorer si le projet n'existe plus
            }
        } else if ("TASK".equals(notification.getRelatedEntityType()) && notification.getRelatedEntityId() != null) {
            try {
                Task task = taskRepository.findById(notification.getRelatedEntityId()).orElse(null);
                if (task != null) {
                    dto.setTaskId(task.getId());
                    dto.setTaskTitle(task.getTitle());
                    
                    // Récupérer aussi le projet via la tâche
                    if (task.getProject() != null) {
                        dto.setProjectId(task.getProject().getId());
                        dto.setProjectName(task.getProject().getName());
                    }
                }
            } catch (Exception e) {
                // Ignorer si la tâche n'existe plus
            }
        }
        
        return dto;
    }
} 