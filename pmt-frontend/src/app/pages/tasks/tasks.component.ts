import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="tasks-container">
      <div class="header">
        <h1>Mes Tâches Assignées</h1>
        <button mat-raised-button color="primary" (click)="createNewTask()">
          <mat-icon>add</mat-icon>
          Nouvelle Tâche
        </button>
      </div>

      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Chargement des tâches...</p>
      </div>

      <div class="tasks-grid" *ngIf="!loading && tasks.length > 0">
        <mat-card *ngFor="let task of tasks" class="task-card">
          <mat-card-header>
            <mat-card-title>{{ task.title }}</mat-card-title>
            <mat-card-subtitle>
              Projet: {{ task.projectName || 'N/A' }}
            </mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <p>{{ task.description || 'Aucune description' }}</p>
            <div class="task-meta">
              <mat-chip [color]="getPriorityColor(task.priority)" selected>
                {{ task.priority }}
              </mat-chip>
              <mat-chip color="accent" selected>
                {{ task.statusName || task.status?.name || 'TODO' }}
              </mat-chip>
            </div>
            <p *ngIf="task.dueDate" class="due-date">
              Échéance: {{ task.dueDate | date:'dd/MM/yyyy' }}
            </p>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-button color="primary" (click)="viewTask(task.id)">
              <mat-icon>visibility</mat-icon>
              Voir
            </button>
            <button mat-button (click)="editTask(task.id)">
              <mat-icon>edit</mat-icon>
              Modifier
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div *ngIf="!loading && tasks.length === 0" class="no-tasks">
        <mat-icon class="no-tasks-icon">assignment</mat-icon>
        <h2>Aucune tâche assignée</h2>
        <p>Vous n'avez pas encore de tâches assignées à votre compte.</p>
        <button mat-raised-button color="primary" (click)="createNewTask()">
          <mat-icon>add</mat-icon>
          Créer une tâche
        </button>
      </div>
    </div>
  `,
  styles: [`
    .tasks-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header h1 {
      margin: 0;
      color: #333;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: #666;
    }

    .loading-container p {
      margin-top: 16px;
      font-size: 16px;
    }

    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .task-card {
      height: fit-content;
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }

    .task-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .task-meta {
      margin-top: 16px;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .due-date {
      margin-top: 8px;
      font-size: 14px;
      color: #666;
    }

    .no-tasks {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-tasks-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .no-tasks h2 {
      margin: 16px 0;
      color: #333;
    }

    .no-tasks p {
      margin-bottom: 24px;
      font-size: 16px;
    }
  `]
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;

  constructor(
    private taskService: TaskService, 
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté avant de charger les tâches
    if (this.authService.isLoggedIn()) {
      this.loadTasks();
    } else {
      // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
      this.router.navigate(['/login']);
    }
  }

  loadTasks(): void {
    this.loading = true;
    this.cdr.detectChanges();
    
    this.taskService.getCurrentUserTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tâches:', error);
        // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
        if (error.message === 'Utilisateur non connecté') {
          this.router.navigate(['/login']);
        } else {
          // Pour d'autres erreurs, afficher un message et continuer
          this.tasks = [];
        }
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'HIGH':
      case 'URGENT':
        return 'warn';
      case 'MEDIUM':
        return 'accent';
      default:
        return 'primary';
    }
  }

  createNewTask(): void {
    this.router.navigate(['/dashboard/tasks/create']);
  }

  editTask(taskId: number | undefined): void {
    if (taskId) {
      this.router.navigate(['/dashboard/tasks', taskId, 'edit']);
    }
  }

  viewTask(taskId: number | undefined): void {
    if (taskId) {
      this.router.navigate(['/dashboard/tasks', taskId, 'view']);
    }
  }
} 