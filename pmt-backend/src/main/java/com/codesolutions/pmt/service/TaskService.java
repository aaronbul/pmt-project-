package com.codesolutions.pmt.service;

import com.codesolutions.pmt.dto.TaskCreateDTO;
import com.codesolutions.pmt.dto.TaskUpdateDTO;
import com.codesolutions.pmt.entity.Task;
import com.codesolutions.pmt.entity.TaskStatus;
import com.codesolutions.pmt.entity.TaskStatusEnum;
import com.codesolutions.pmt.entity.Project;
import com.codesolutions.pmt.entity.User;
import com.codesolutions.pmt.repository.TaskRepository;
import com.codesolutions.pmt.repository.TaskStatusRepository;
import com.codesolutions.pmt.repository.ProjectRepository;
import com.codesolutions.pmt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskStatusRepository taskStatusRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Récupérer toutes les tâches
     */
    public List<Task> getAllTasks() {
        return taskRepository.findAllWithRelations();
    }

    /**
     * Récupérer une tâche par son ID
     */
    public Task getTaskById(Long id) {
        Task task = taskRepository.findByIdWithRelations(id);
        if (task == null) {
            throw new RuntimeException("Tâche non trouvée avec l'ID: " + id);
        }
        return task;
    }

    /**
     * Récupérer toutes les tâches d'un projet
     */
    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectIdWithRelations(projectId);
    }

    /**
     * Récupérer les tâches par statut
     */
    public List<Task> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status);
    }

    /**
     * Récupérer les tâches assignées à un utilisateur
     */
    public List<Task> getTasksAssignedToUser(Long userId) {
        return taskRepository.findByAssignedToId(userId);
    }

    /**
     * Créer une nouvelle tâche
     */
    public Task createTask(TaskCreateDTO taskCreateDTO) {
        Task task = new Task();
        task.setTitle(taskCreateDTO.getTitle());
        task.setDescription(taskCreateDTO.getDescription());
        
        // Statut par défaut - utiliser un statut existant ou créer un nouveau
        TaskStatus defaultStatus = getOrCreateDefaultStatus();
        task.setStatus(defaultStatus);
        
        // Priorité par défaut
        task.setPriority(Task.Priority.MEDIUM);
        
        // Date d'échéance
        if (taskCreateDTO.getDueDate() != null) {
            task.setDueDate(taskCreateDTO.getDueDate());
        }

        // Associer le projet
        if (taskCreateDTO.getProjectId() != null) {
            Project project = projectRepository.findById(taskCreateDTO.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'ID: " + taskCreateDTO.getProjectId()));
            task.setProject(project);
        }

        // Associer l'utilisateur assigné
        if (taskCreateDTO.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(taskCreateDTO.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID: " + taskCreateDTO.getAssignedToId()));
            task.setAssignedTo(assignedTo);
        }

        // Associer l'utilisateur créateur
        if (taskCreateDTO.getCreatedById() != null) {
            User createdBy = userRepository.findById(taskCreateDTO.getCreatedById())
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID: " + taskCreateDTO.getCreatedById()));
            task.setCreatedBy(createdBy);
        }

        return taskRepository.save(task);
    }

    /**
     * Récupérer ou créer le statut par défaut
     */
    private TaskStatus getOrCreateDefaultStatus() {
        // Essayer de trouver un statut "TODO" existant
        Optional<TaskStatus> existingStatus = taskStatusRepository.findByName("TODO");
        if (existingStatus.isPresent()) {
            return existingStatus.get();
        }
        
        // Si le statut n'existe pas, créer un nouveau
        TaskStatus defaultStatus = new TaskStatus("TODO");
        return taskStatusRepository.save(defaultStatus);
    }

    /**
     * Mettre à jour une tâche
     */
    public Task updateTask(Long id, TaskUpdateDTO taskUpdateDTO) {
        System.out.println("Mise à jour de la tâche " + id + " avec priorité: " + taskUpdateDTO.getPriority() + ", statut: " + taskUpdateDTO.getStatus());
        Task task = taskRepository.findByIdWithRelations(id);
        if (task == null) {
            throw new RuntimeException("Tâche non trouvée avec l'ID: " + id);
        }

        if (taskUpdateDTO.getTitle() != null) {
            task.setTitle(taskUpdateDTO.getTitle());
        }
        if (taskUpdateDTO.getDescription() != null) {
            task.setDescription(taskUpdateDTO.getDescription());
        }
        if (taskUpdateDTO.getPriority() != null) {
            // Convertir TaskPriority vers Task.Priority
            Task.Priority priority = convertTaskPriority(taskUpdateDTO.getPriority());
            System.out.println("Conversion de priorité: " + taskUpdateDTO.getPriority() + " -> " + priority);
            task.setPriority(priority);
        }
        if (taskUpdateDTO.getStatus() != null) {
            // Convertir la chaîne en TaskStatusEnum puis en TaskStatus
            TaskStatusEnum statusEnum = taskUpdateDTO.getStatusEnum();
            TaskStatus status = convertTaskStatus(statusEnum);
            System.out.println("Conversion de statut: " + taskUpdateDTO.getStatus() + " -> " + statusEnum + " -> " + status.getName());
            task.setStatus(status);
        }
        if (taskUpdateDTO.getDueDate() != null) {
            task.setDueDate(taskUpdateDTO.getDueDate());
        }
        
        // Gérer l'assignation
        if (taskUpdateDTO.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(taskUpdateDTO.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID: " + taskUpdateDTO.getAssignedToId()));
            task.setAssignedTo(assignedTo);
            System.out.println("Tâche assignée à: " + assignedTo.getUsername());
        } else {
            task.setAssignedTo(null); // Désassigner la tâche
            System.out.println("Tâche désassignée");
        }

        // Mettre à jour la date de modification
        task.setUpdatedAt(LocalDateTime.now());

        Task savedTask = taskRepository.save(task);
        System.out.println("Tâche sauvegardée avec priorité: " + savedTask.getPriority() + ", statut: " + savedTask.getStatus().getName());
        return savedTask;
    }

    /**
     * Convertir TaskPriority vers Task.Priority
     */
    private Task.Priority convertTaskPriority(com.codesolutions.pmt.entity.TaskPriority taskPriority) {
        switch (taskPriority) {
            case LOW:
                return Task.Priority.LOW;
            case MEDIUM:
                return Task.Priority.MEDIUM;
            case HIGH:
                return Task.Priority.HIGH;
            case URGENT:
                return Task.Priority.URGENT;
            default:
                return Task.Priority.MEDIUM;
        }
    }

    /**
     * Convertir TaskStatusEnum vers TaskStatus
     */
    private TaskStatus convertTaskStatus(TaskStatusEnum statusEnum) {
        String statusName;
        switch (statusEnum) {
            case TODO:
                statusName = "TODO";
                break;
            case IN_PROGRESS:
                statusName = "IN_PROGRESS";
                break;
            case REVIEW:
                statusName = "REVIEW";
                break;
            case DONE:
                statusName = "DONE";
                break;
            case CANCELLED:
                statusName = "CANCELLED";
                break;
            default:
                statusName = "TODO";
        }
        
        // Chercher le statut existant ou le créer
        Optional<TaskStatus> existingStatus = taskStatusRepository.findByName(statusName);
        if (existingStatus.isPresent()) {
            return existingStatus.get();
        } else {
            TaskStatus newStatus = new TaskStatus(statusName);
            return taskStatusRepository.save(newStatus);
        }
    }

    /**
     * Assigner une tâche à un utilisateur
     */
    public Task assignTask(Long taskId, Long userId) {
        Task task = taskRepository.findByIdWithRelations(taskId);
        if (task == null) {
            throw new RuntimeException("Tâche non trouvée avec l'ID: " + taskId);
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID: " + userId));

        task.setAssignedTo(user);
        task.setUpdatedAt(LocalDateTime.now());

        return taskRepository.save(task);
    }

    /**
     * Mettre à jour le statut d'une tâche
     */
    public Task updateTaskStatus(Long taskId, TaskStatus status) {
        Task task = taskRepository.findByIdWithRelations(taskId);
        if (task == null) {
            throw new RuntimeException("Tâche non trouvée avec l'ID: " + taskId);
        }
        task.setStatus(status);

        return taskRepository.save(task);
    }

    /**
     * Supprimer une tâche
     */
    public void deleteTask(Long id) {
        Task task = taskRepository.findByIdWithRelations(id);
        if (task == null) {
            throw new RuntimeException("Tâche non trouvée avec l'ID: " + id);
        }
        taskRepository.delete(task);
    }
} 