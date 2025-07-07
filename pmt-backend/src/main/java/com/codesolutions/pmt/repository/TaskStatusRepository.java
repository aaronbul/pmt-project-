package com.codesolutions.pmt.repository;

import com.codesolutions.pmt.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaskStatusRepository extends JpaRepository<TaskStatus, Integer> {
    
    /**
     * Trouver un statut par son nom
     */
    Optional<TaskStatus> findByName(String name);
    
    /**
     * Vérifier si un statut existe par son nom
     */
    boolean existsByName(String name);
} 