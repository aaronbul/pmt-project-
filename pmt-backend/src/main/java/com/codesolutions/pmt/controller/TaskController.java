package com.codesolutions.pmt.controller;

import com.codesolutions.pmt.dto.TaskDTO;
import com.codesolutions.pmt.dto.TaskCreateDTO;
import com.codesolutions.pmt.dto.TaskUpdateDTO;
import com.codesolutions.pmt.entity.Task;
import com.codesolutions.pmt.entity.TaskStatus;
import com.codesolutions.pmt.entity.TaskStatusEnum;
import com.codesolutions.pmt.entity.TaskPriority;
import com.codesolutions.pmt.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:4200")
public class TaskController {

    @Autowired
    private TaskService taskService;

    /**
     * Récupérer toutes les tâches
     */
    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        List<TaskDTO> taskDTOs = tasks.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(taskDTOs);
    }

    /**
     * Récupérer une tâche par son ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
        try {
            Task task = taskService.getTaskById(id);
            return ResponseEntity.ok(convertToDTO(task));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("non trouvée")) {
                return ResponseEntity.notFound().build();
            }
            throw e;
        }
    }

    /**
     * Récupérer toutes les tâches d'un projet
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TaskDTO>> getTasksByProject(@PathVariable Long projectId) {
        List<Task> tasks = taskService.getTasksByProject(projectId);
        List<TaskDTO> taskDTOs = tasks.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(taskDTOs);
    }

    /**
     * Récupérer les tâches par statut
     */
    @GetMapping("/status/{statusId}")
    public ResponseEntity<List<TaskDTO>> getTasksByStatus(@PathVariable Integer statusId) {
        // Pour l'instant, on récupère toutes les tâches
        // TODO: Implémenter la logique de filtrage par statut
        List<Task> tasks = taskService.getAllTasks();
        List<TaskDTO> taskDTOs = tasks.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(taskDTOs);
    }

    /**
     * Récupérer les tâches assignées à un utilisateur
     */
    @GetMapping("/assigned/{userId}")
    public ResponseEntity<List<TaskDTO>> getTasksAssignedToUser(@PathVariable Long userId) {
        List<Task> tasks = taskService.getTasksAssignedToUser(userId);
        List<TaskDTO> taskDTOs = tasks.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(taskDTOs);
    }

    /**
     * Récupérer les tâches assignées à un utilisateur (alias)
     */
    @GetMapping("/assignee/{userId}")
    public ResponseEntity<List<TaskDTO>> getTasksByAssignee(@PathVariable Long userId) {
        List<Task> tasks = taskService.getTasksAssignedToUser(userId);
        List<TaskDTO> taskDTOs = tasks.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(taskDTOs);
    }

    /**
     * Créer une nouvelle tâche
     */
    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskCreateDTO taskCreateDTO) {
        Task createdTask = taskService.createTask(taskCreateDTO);
        return ResponseEntity.ok(convertToDTO(createdTask));
    }

    /**
     * Mettre à jour une tâche
     */
    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @RequestBody TaskUpdateDTO taskUpdateDTO) {
        try {
            System.out.println("=== MISE À JOUR TÂCHE " + id + " ===");
            System.out.println("Titre: " + taskUpdateDTO.getTitle());
            System.out.println("Description: " + taskUpdateDTO.getDescription());
            System.out.println("Priorité: " + taskUpdateDTO.getPriority());
            System.out.println("Statut: " + taskUpdateDTO.getStatus());
            System.out.println("Assigné à: " + taskUpdateDTO.getAssignedToId());
            System.out.println("Date d'échéance: " + taskUpdateDTO.getDueDate());
            System.out.println("=====================================");
            
            Task updatedTask = taskService.updateTask(id, taskUpdateDTO);
            return ResponseEntity.ok(convertToDTO(updatedTask));
        } catch (Exception e) {
            System.err.println("Erreur lors de la mise à jour de la tâche " + id + ": " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Assigner une tâche à un utilisateur
     */
    @PutMapping("/{id}/assign/{userId}")
    public ResponseEntity<TaskDTO> assignTask(@PathVariable Long id, @PathVariable Long userId) {
        Task assignedTask = taskService.assignTask(id, userId);
        return ResponseEntity.ok(convertToDTO(assignedTask));
    }

    /**
     * Changer le statut d'une tâche
     */
    @PutMapping("/{id}/status/{status}")
    public ResponseEntity<TaskDTO> updateTaskStatus(@PathVariable Long id, @PathVariable TaskStatus status) {
        Task updatedTask = taskService.updateTaskStatus(id, status);
        return ResponseEntity.ok(convertToDTO(updatedTask));
    }

    /**
     * Supprimer une tâche
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Conversion Task vers TaskDTO
     */
    private TaskDTO convertToDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        
        // Conversion du statut
        if (task.getStatus() != null) {
            // Convertir TaskStatus -> TaskStatusEnum
            TaskStatusEnum statusEnum = convertTaskStatusToEnum(task.getStatus().getName());
            dto.setStatus(statusEnum);
            dto.setStatusName(task.getStatus().getName());
        }
        
        // Conversion de la priorité
        if (task.getPriority() != null) {
            switch (task.getPriority()) {
                case LOW:
                    dto.setPriority(TaskPriority.LOW);
                    break;
                case MEDIUM:
                    dto.setPriority(TaskPriority.MEDIUM);
                    break;
                case HIGH:
                    dto.setPriority(TaskPriority.HIGH);
                    break;
                case URGENT:
                    dto.setPriority(TaskPriority.URGENT);
                    break;
                default:
                    dto.setPriority(TaskPriority.MEDIUM);
            }
        }
        
        // Conversion de la date d'échéance
        if (task.getDueDate() != null) {
            dto.setDueDate(task.getDueDate().atStartOfDay());
        }
        
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        
        if (task.getProject() != null) {
            dto.setProjectId(task.getProject().getId());
            dto.setProjectName(task.getProject().getName());
        }
        
        if (task.getAssignedTo() != null) {
            dto.setAssignedToId(task.getAssignedTo().getId());
            dto.setAssignedToName(task.getAssignedTo().getUsername());
        }
        
        if (task.getCreatedBy() != null) {
            dto.setCreatedById(task.getCreatedBy().getId());
            dto.setCreatedByName(task.getCreatedBy().getUsername());
        }
        
        return dto;
    }

    /**
     * Convertir le nom du statut en TaskStatusEnum
     */
    private TaskStatusEnum convertTaskStatusToEnum(String statusName) {
        if (statusName == null) {
            return TaskStatusEnum.TODO;
        }
        
        switch (statusName) {
            case "TODO":
                return TaskStatusEnum.TODO;
            case "IN_PROGRESS":
                return TaskStatusEnum.IN_PROGRESS;
            case "REVIEW":
                return TaskStatusEnum.REVIEW;
            case "DONE":
                return TaskStatusEnum.DONE;
            case "CANCELLED":
                return TaskStatusEnum.CANCELLED;
            default:
                return TaskStatusEnum.TODO;
        }
    }
} 