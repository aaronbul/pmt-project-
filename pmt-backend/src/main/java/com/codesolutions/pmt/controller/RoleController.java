package com.codesolutions.pmt.controller;

import com.codesolutions.pmt.entity.Role;
import com.codesolutions.pmt.service.RoleService;
import com.codesolutions.pmt.dto.RoleDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "http://localhost:4200")
public class RoleController {

    @Autowired
    private RoleService roleService;

    /**
     * Récupérer tous les rôles (version DTO, sans boucle infinie)
     */
    @GetMapping
    public ResponseEntity<List<RoleDTO>> getAllRoles() {
        List<Role> roles = roleService.getAllRoles();
        List<RoleDTO> dtos = roles.stream()
            .map(role -> new RoleDTO(role.getId(), role.getName()))
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * Récupérer un rôle par son ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<RoleDTO> getRoleById(@PathVariable Integer id) {
        Role role = roleService.getRoleById(id);
        if (role != null) {
            return ResponseEntity.ok(new RoleDTO(role.getId(), role.getName()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint de test pour vérifier les rôles
     */
    @GetMapping("/test")
    public ResponseEntity<String> testRoles() {
        List<Role> roles = roleService.getAllRoles();
        StringBuilder result = new StringBuilder();
        result.append("Test des rôles - Nombre trouvé: ").append(roles.size()).append("\n");
        roles.forEach(role -> result.append("- ").append(role.getName()).append(" (ID: ").append(role.getId()).append(")\n"));
        return ResponseEntity.ok(result.toString());
    }
} 