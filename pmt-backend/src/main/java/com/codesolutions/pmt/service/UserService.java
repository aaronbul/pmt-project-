package com.codesolutions.pmt.service;

import com.codesolutions.pmt.dto.UserDTO;
import com.codesolutions.pmt.entity.User;
import com.codesolutions.pmt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Crée un nouvel utilisateur
     */
    public UserDTO createUser(UserDTO userDto) {
        // Vérifier si l'username existe déjà
        if (userRepository.existsByUsername(userDto.getUsername())) {
            throw new RuntimeException("Le nom d'utilisateur existe déjà");
        }
        
        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("L'email existe déjà");
        }
        
        // Créer l'utilisateur
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        
        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }
    
    /**
     * Trouve un utilisateur par son ID
     */
    public UserDTO findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID: " + id));
        return convertToDto(user);
    }
    
    /**
     * Trouve un utilisateur par son nom d'utilisateur
     */
    public UserDTO findByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé: " + username));
        return convertToDto(user);
    }
    
    /**
     * Trouve un utilisateur par son email
     */
    public UserDTO findByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'email: " + email));
        return convertToDto(user);
    }
    
    /**
     * Trouve tous les utilisateurs
     */
    public List<UserDTO> findAll() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Trouve les utilisateurs par nom d'utilisateur (recherche partielle)
     */
    public List<UserDTO> findByUsernameContaining(String username) {
        return userRepository.findByUsernameContainingIgnoreCase(username).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Trouve les utilisateurs par email (recherche partielle)
     */
    public List<UserDTO> findByEmailContaining(String email) {
        return userRepository.findByEmailContainingIgnoreCase(email).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Trouve les utilisateurs membres d'un projet
     */
    public List<UserDTO> findUsersByProjectId(Long projectId) {
        return userRepository.findUsersByProjectId(projectId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Trouve les utilisateurs avec un rôle spécifique dans un projet
     */
    public List<UserDTO> findUsersByProjectIdAndRole(Long projectId, String roleName) {
        return userRepository.findUsersByProjectIdAndRole(projectId, roleName).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Trouve les utilisateurs avec des tâches assignées
     */
    public List<UserDTO> findUsersWithAssignedTasks() {
        return userRepository.findUsersWithAssignedTasks().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Met à jour un utilisateur
     */
    public UserDTO updateUser(Long id, UserDTO userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID: " + id));
        
        // Vérifier si le nouveau username existe déjà (sauf pour l'utilisateur actuel)
        if (!user.getUsername().equals(userDto.getUsername()) && 
            userRepository.existsByUsername(userDto.getUsername())) {
            throw new RuntimeException("Le nom d'utilisateur existe déjà");
        }
        
        // Vérifier si le nouveau email existe déjà (sauf pour l'utilisateur actuel)
        if (!user.getEmail().equals(userDto.getEmail()) && 
            userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("L'email existe déjà");
        }
        
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        
        // Mettre à jour le mot de passe seulement s'il est fourni
        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }
        
        User updatedUser = userRepository.save(user);
        return convertToDto(updatedUser);
    }
    
    /**
     * Supprime un utilisateur
     */
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Utilisateur non trouvé avec l'ID: " + id);
        }
        userRepository.deleteById(id);
    }
    
    /**
     * Vérifie les identifiants de connexion
     */
    public UserDTO authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }
        
        return convertToDto(user);
    }
    
    /**
     * Convertit une entité User en DTO
     */
    private UserDTO convertToDto(User user) {
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
    
    /**
     * Trouve une entité User par ID (pour les services internes)
     */
    public User findUserEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID: " + id));
    }
    
    /**
     * Trouve une entité User par email (pour les services internes)
     */
    public User findUserEntityByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'email: " + email));
    }
} 