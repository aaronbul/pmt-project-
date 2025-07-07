package com.codesolutions.pmt.repository;

import com.codesolutions.pmt.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    
    /**
     * Trouver un rôle par son nom
     */
    Optional<Role> findByName(String name);
    
    /**
     * Vérifie si un rôle existe par son nom
     */
    boolean existsByName(String name);
} 