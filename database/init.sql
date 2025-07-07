-- PMT - Project Management Tool
-- Script d'initialisation complet de la base de données

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS pmt_db;
USE pmt_db;

-- Suppression des tables existantes (si elles existent)
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS task_history;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS task_status;
DROP TABLE IF EXISTS project_members;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;

-- Table des utilisateurs
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des projets
CREATE TABLE projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Enum des rôles (simulé avec une table)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
);

-- Table de liaison projet-utilisateur avec rôle
CREATE TABLE project_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role_id INT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    UNIQUE KEY unique_project_user (project_id, user_id)
);

-- Enum des statuts de tâche (simulé avec une table)
CREATE TABLE task_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
);

-- Table des tâches
CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status_id INT NOT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
    project_id BIGINT NOT NULL,
    assigned_to BIGINT,
    created_by BIGINT NOT NULL,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (status_id) REFERENCES task_status(id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Table de l'historique des tâches
CREATE TABLE task_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'CREATED', 'UPDATED', 'STATUS_CHANGED', 'ASSIGNED'
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des notifications
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'TASK_ASSIGNED', 'TASK_UPDATED', 'PROJECT_INVITATION'
    is_read BOOLEAN DEFAULT FALSE,
    related_entity_type VARCHAR(50), -- 'TASK', 'PROJECT'
    related_entity_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index pour optimiser les performances
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_project_members_user ON project_members(user_id);
CREATE INDEX idx_task_history_task ON task_history(task_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- Insertion des données de base
-- Rôles
INSERT INTO roles (name) VALUES 
('ADMIN'),
('MEMBER'),
('OBSERVER');

-- Statuts de tâche
INSERT INTO task_status (name) VALUES 
('TODO'),
('IN_PROGRESS'),
('REVIEW'),
('DONE'),
('CANCELLED');

-- Utilisateurs de test
INSERT INTO users (username, email, password) VALUES 
('john.doe', 'john.doe@example.com', '$2a$10$IHDJHHDBiTkRL/Dx.givaum90BxkTtNH3IIfqoAQwqJZkOpVvhU8u'), -- password: password123
('mariana.silva', 'mariana.silva@example.com', '$2a$10$IHDJHHDBiTkRL/Dx.givaum90BxkTtNH3IIfqoAQwqJZkOpVvhU8u'),
('nicolas.martin', 'nicolas.martin@example.com', '$2a$10$IHDJHHDBiTkRL/Dx.givaum90BxkTtNH3IIfqoAQwqJZkOpVvhU8u'),
('alice.dupont', 'alice.dupont@example.com', '$2a$10$IHDJHHDBiTkRL/Dx.givaum90BxkTtNH3IIfqoAQwqJZkOpVvhU8u'),
('bob.wilson', 'bob.wilson@example.com', '$2a$10$IHDJHHDBiTkRL/Dx.givaum90BxkTtNH3IIfqoAQwqJZkOpVvhU8u');

-- Projets de test
INSERT INTO projects (name, description, start_date, created_by) VALUES 
('PMT - Project Management Tool', 'Développement d\'une plateforme de gestion de projet collaboratif', '2024-01-15', 1),
('E-commerce Platform', 'Création d\'une plateforme e-commerce moderne', '2024-02-01', 2),
('Mobile App Redesign', 'Refonte complète de l\'application mobile', '2024-01-20', 3);

-- Membres de projet
INSERT INTO project_members (project_id, user_id, role_id) VALUES 
-- Projet PMT
(1, 1, 1), -- John Doe - Admin
(1, 2, 2), -- Mariana Silva - Member
(1, 3, 2), -- Nicolas Martin - Member
(1, 4, 3), -- Alice Dupont - Observer

-- Projet E-commerce
(2, 2, 1), -- Mariana Silva - Admin
(2, 1, 2), -- John Doe - Member
(2, 5, 2), -- Bob Wilson - Member

-- Projet Mobile App
(3, 3, 1), -- Nicolas Martin - Admin
(3, 1, 2), -- John Doe - Member
(3, 4, 2); -- Alice Dupont - Member

-- Tâches de test
INSERT INTO tasks (title, description, status_id, priority, project_id, assigned_to, created_by, due_date) VALUES 
-- Tâches du projet PMT
('Conception de la base de données', 'Créer le schéma de base de données avec toutes les entités', 1, 'HIGH', 1, 1, 1, '2024-01-25'),
('Développement du backend Spring Boot', 'Implémenter les contrôleurs REST et services', 2, 'HIGH', 1, 2, 1, '2024-02-10'),
('Création de l\'interface Angular', 'Développer les composants frontend', 1, 'MEDIUM', 1, 3, 1, '2024-02-15'),
('Tests unitaires backend', 'Écrire les tests JUnit et Mockito', 1, 'MEDIUM', 1, 2, 1, '2024-02-20'),
('Configuration Docker', 'Dockeriser l\'application complète', 1, 'LOW', 1, 4, 1, '2024-02-25'),

-- Tâches du projet E-commerce
('Analyse des besoins', 'Recueillir les besoins fonctionnels', 3, 'HIGH', 2, 2, 2, '2024-02-15'),
('Design de l\'interface', 'Créer les maquettes UI/UX', 2, 'MEDIUM', 2, 1, 2, '2024-02-20'),
('Intégration paiement', 'Intégrer Stripe pour les paiements', 1, 'HIGH', 2, 5, 2, '2024-03-01'),

-- Tâches du projet Mobile App
('Audit de l\'application existante', 'Analyser les problèmes actuels', 4, 'HIGH', 3, 3, 3, '2024-01-30'),
('Nouveau design mobile', 'Créer les nouvelles maquettes', 2, 'MEDIUM', 3, 4, 3, '2024-02-10'),
('Migration des données', 'Migrer les données vers la nouvelle structure', 1, 'HIGH', 3, 1, 3, '2024-02-25');

-- Historique des tâches
INSERT INTO task_history (task_id, user_id, action, old_value, new_value) VALUES 
(1, 1, 'CREATED', NULL, 'Tâche créée'),
(2, 1, 'CREATED', NULL, 'Tâche créée'),
(2, 2, 'STATUS_CHANGED', 'TODO', 'IN_PROGRESS'),
(3, 1, 'CREATED', NULL, 'Tâche créée'),
(3, 1, 'ASSIGNED', NULL, '3'),
(4, 1, 'CREATED', NULL, 'Tâche créée'),
(5, 1, 'CREATED', NULL, 'Tâche créée'),
(6, 2, 'CREATED', NULL, 'Tâche créée'),
(6, 2, 'STATUS_CHANGED', 'TODO', 'REVIEW'),
(7, 2, 'CREATED', NULL, 'Tâche créée'),
(7, 2, 'ASSIGNED', NULL, '1'),
(8, 2, 'CREATED', NULL, 'Tâche créée'),
(9, 3, 'CREATED', NULL, 'Tâche créée'),
(9, 3, 'STATUS_CHANGED', 'TODO', 'DONE'),
(10, 3, 'CREATED', NULL, 'Tâche créée'),
(10, 3, 'ASSIGNED', NULL, '4'),
(11, 3, 'CREATED', NULL, 'Tâche créée'),
(11, 3, 'ASSIGNED', NULL, '1');

-- Notifications de test
INSERT INTO notifications (user_id, title, message, type, related_entity_type, related_entity_id) VALUES 
(2, 'Tâche assignée', 'La tâche "Développement du backend Spring Boot" vous a été assignée', 'TASK_ASSIGNED', 'TASK', 2),
(3, 'Tâche assignée', 'La tâche "Création de l\'interface Angular" vous a été assignée', 'TASK_ASSIGNED', 'TASK', 3),
(1, 'Tâche assignée', 'La tâche "Design de l\'interface" vous a été assignée', 'TASK_ASSIGNED', 'TASK', 7),
(4, 'Tâche assignée', 'La tâche "Nouveau design mobile" vous a été assignée', 'TASK_ASSIGNED', 'TASK', 10),
(1, 'Tâche assignée', 'La tâche "Migration des données" vous a été assignée', 'TASK_ASSIGNED', 'TASK', 11),
(2, 'Statut mis à jour', 'Le statut de la tâche "Analyse des besoins" a été mis à jour vers REVIEW', 'TASK_UPDATED', 'TASK', 6),
(3, 'Statut mis à jour', 'Le statut de la tâche "Audit de l\'application existante" a été mis à jour vers DONE', 'TASK_UPDATED', 'TASK', 9);

-- Affichage des informations de connexion
SELECT 'Base de données PMT initialisée avec succès!' as message;
SELECT 'Utilisateurs de test créés:' as info;
SELECT username, email, 'password: password123' as password FROM users;
SELECT 'Base de données: pmt_db' as database_info; 