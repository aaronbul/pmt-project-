package com.codesolutions.pmt.controller;

import com.codesolutions.pmt.dto.TaskHistoryDTO;
import com.codesolutions.pmt.entity.TaskHistory;
import com.codesolutions.pmt.service.TaskHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/task-history")
@CrossOrigin(origins = "http://localhost:4200")
public class TaskHistoryController {

    @Autowired
    private TaskHistoryService taskHistoryService;

    /**
     * Récupérer tout l'historique des tâches
     */
    @GetMapping
    public ResponseEntity<List<TaskHistoryDTO>> getAllTaskHistory() {
        List<TaskHistory> history = taskHistoryService.getAllTaskHistory();
        List<TaskHistoryDTO> historyDTOs = history.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(historyDTOs);
    }

    /**
     * Récupérer un historique par son ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<TaskHistoryDTO> getTaskHistoryById(@PathVariable Long id) {
        TaskHistory history = taskHistoryService.getTaskHistoryById(id);
        return ResponseEntity.ok(convertToDTO(history));
    }

    /**
     * Récupérer l'historique d'une tâche
     */
    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<TaskHistoryDTO>> getTaskHistoryByTask(@PathVariable Long taskId) {
        List<TaskHistory> history = taskHistoryService.getTaskHistoryByTask(taskId);
        List<TaskHistoryDTO> historyDTOs = history.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(historyDTOs);
    }

    /**
     * Récupérer l'historique d'un projet
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TaskHistoryDTO>> getTaskHistoryByProject(@PathVariable Long projectId) {
        List<TaskHistory> history = taskHistoryService.getTaskHistoryByProject(projectId);
        List<TaskHistoryDTO> historyDTOs = history.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(historyDTOs);
    }

    /**
     * Récupérer l'historique d'un utilisateur
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskHistoryDTO>> getTaskHistoryByUser(@PathVariable Long userId) {
        List<TaskHistory> history = taskHistoryService.getTaskHistoryByUser(userId);
        List<TaskHistoryDTO> historyDTOs = history.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(historyDTOs);
    }

    /**
     * Récupérer l'historique par type d'action
     */
    @GetMapping("/action/{action}")
    public ResponseEntity<List<TaskHistoryDTO>> getTaskHistoryByAction(@PathVariable String action) {
        List<TaskHistory> history = taskHistoryService.getTaskHistoryByAction(action);
        List<TaskHistoryDTO> historyDTOs = history.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(historyDTOs);
    }

    /**
     * Récupérer l'historique récent d'une tâche (limité)
     */
    @GetMapping("/task/{taskId}/recent")
    public ResponseEntity<List<TaskHistoryDTO>> getRecentTaskHistory(@PathVariable Long taskId) {
        List<TaskHistory> history = taskHistoryService.getRecentTaskHistory(taskId);
        List<TaskHistoryDTO> historyDTOs = history.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(historyDTOs);
    }

    /**
     * Supprimer un historique
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTaskHistory(@PathVariable Long id) {
        taskHistoryService.deleteTaskHistory(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Supprimer tout l'historique d'une tâche
     */
    @DeleteMapping("/task/{taskId}")
    public ResponseEntity<Void> deleteTaskHistoryByTask(@PathVariable Long taskId) {
        taskHistoryService.deleteTaskHistoryByTask(taskId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Conversion TaskHistory vers TaskHistoryDTO
     */
    private TaskHistoryDTO convertToDTO(TaskHistory history) {
        TaskHistoryDTO dto = new TaskHistoryDTO();
        dto.setId(history.getId());
        dto.setAction(history.getAction());
        dto.setOldValue(history.getOldValue());
        dto.setNewValue(history.getNewValue());
        dto.setTimestamp(history.getCreatedAt());
        
        if (history.getTask() != null) {
            dto.setTaskId(history.getTask().getId());
            dto.setTaskTitle(history.getTask().getTitle());
            
            // Récupérer le projet via la tâche
            if (history.getTask().getProject() != null) {
                dto.setProjectId(history.getTask().getProject().getId());
                dto.setProjectName(history.getTask().getProject().getName());
            }
        }
        
        if (history.getUser() != null) {
            dto.setUserId(history.getUser().getId());
            dto.setUsername(history.getUser().getUsername());
        }
        
        return dto;
    }
} 