package com.codesolutions.pmt.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class HomeController {
    
    /**
     * GET / - Page d'accueil de l'API
     */
    @GetMapping
    public Map<String, Object> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Bienvenue sur l'API PMT - Project Management Tool");
        response.put("version", "1.0.0");
        response.put("status", "running");
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("users", "/api/users");
        endpoints.put("projects", "/api/projects");
        endpoints.put("tasks", "/api/tasks");
        endpoints.put("notifications", "/api/notifications");
        
        response.put("endpoints", endpoints);
        
        return response;
    }
    
    /**
     * GET /health - Endpoint de santé de l'application
     */
    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    /**
     * GET /info - Informations sur l'application
     */
    @GetMapping("/info")
    public Map<String, Object> info() {
        Map<String, Object> response = new HashMap<>();
        response.put("application", "PMT - Project Management Tool");
        response.put("description", "Backend Spring Boot pour l'application PMT");
        response.put("version", "1.0.0");
        response.put("java_version", System.getProperty("java.version"));
        response.put("spring_version", "3.5.3");
        
        return response;
    }
} 