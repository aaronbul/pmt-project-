package com.codesolutions.pmt.service;

import com.codesolutions.pmt.entity.Role;
import com.codesolutions.pmt.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    /**
     * Récupérer tous les rôles
     */
    public List<Role> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        System.out.println("RoleService.getAllRoles() - Nombre de rôles trouvés: " + roles.size());
        roles.forEach(role -> System.out.println("  - Rôle: " + role.getName() + " (ID: " + role.getId() + ")"));
        return roles;
    }

    /**
     * Récupérer un rôle par son ID
     */
    public Role getRoleById(Integer id) {
        Optional<Role> role = roleRepository.findById(id);
        if (role.isPresent()) {
            System.out.println("RoleService.getRoleById(" + id + ") - Rôle trouvé: " + role.get().getName());
        } else {
            System.out.println("RoleService.getRoleById(" + id + ") - Rôle non trouvé");
        }
        return role.orElse(null);
    }

    /**
     * Récupérer un rôle par son nom
     */
    public Role getRoleByName(String name) {
        Optional<Role> role = roleRepository.findByName(name);
        if (role.isPresent()) {
            System.out.println("RoleService.getRoleByName(" + name + ") - Rôle trouvé: " + role.get().getName() + " (ID: " + role.get().getId() + ")");
        } else {
            System.out.println("RoleService.getRoleByName(" + name + ") - Rôle non trouvé");
        }
        return role.orElse(null);
    }
} 