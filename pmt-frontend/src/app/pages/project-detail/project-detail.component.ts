import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="project-detail-container" *ngIf="project; else loading">
      <div class="header">
        <h1>{{ project.name }}</h1>
        <div class="header-actions">
          <button mat-raised-button color="accent" (click)="manageMembers()" class="mr-2">
            <mat-icon>people</mat-icon>
            Gérer les membres
          </button>
          <button mat-raised-button color="primary" (click)="createNewTask()">
            <mat-icon>add</mat-icon>
            Nouvelle Tâche
          </button>
        </div>
      </div>

      <div class="project-info">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Informations du projet</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p><strong>Description:</strong> {{ project.description || 'Aucune description' }}</p>
            <p><strong>Date de début:</strong> {{ project.startDate | date:'dd/MM/yyyy' }}</p>
            <p><strong>Créé le:</strong> {{ project.createdAt | date:'dd/MM/yyyy' }}</p>
            <p><strong>Membres:</strong> {{ project.memberCount || 0 }} membres</p>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="tasks-section">
        <h2>Tâches du projet</h2>
        <div class="tasks-grid" *ngIf="tasks.length > 0; else noTasks">
          <mat-card *ngFor="let task of tasks" class="task-card">
            <mat-card-header>
              <mat-card-title>{{ task.title }}</mat-card-title>
              <mat-card-subtitle>
                Assigné à: {{ task.assignedToName || 'Non assigné' }}
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

        <ng-template #noTasks>
          <div class="no-tasks">
            <mat-icon class="no-tasks-icon">assignment</mat-icon>
            <h3>Aucune tâche</h3>
            <p>Ce projet n'a pas encore de tâches.</p>
            <button mat-raised-button color="primary" (click)="createNewTask()">
              <mat-icon>add</mat-icon>
              Créer une tâche
            </button>
          </div>
        </ng-template>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading">
        <mat-icon class="loading-icon">hourglass_empty</mat-icon>
        <p>Chargement du projet...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .project-detail-container {
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

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .mr-2 {
      margin-right: 8px;
    }

    .project-info {
      margin-bottom: 32px;
    }

    .tasks-section h2 {
      margin-bottom: 16px;
      color: #333;
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
      padding: 40px 20px;
      color: #666;
    }

    .no-tasks-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .no-tasks h3 {
      margin: 16px 0;
      color: #333;
    }

    .no-tasks p {
      margin-bottom: 24px;
      font-size: 16px;
    }

    .loading {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .loading-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
      margin-bottom: 16px;
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  tasks: Task[] = [];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const projectId = Number(this.route.snapshot.paramMap.get('id'));
    if (projectId) {
      this.loadProject(projectId);
      this.loadProjectTasks(projectId);
    }
  }

  loadProject(projectId: number): void {
    this.projectService.getProjectById(projectId).subscribe({
      next: (project) => {
        this.project = project;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement du projet:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadProjectTasks(projectId: number): void {
    this.taskService.getTasksByProject(projectId).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tâches:', error);
      }
    });
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'HIGH': return 'warn';
      case 'MEDIUM': return 'accent';
      case 'LOW': return 'primary';
      default: return 'primary';
    }
  }

  createNewTask(): void {
    this.router.navigate(['/dashboard/tasks/create'], { 
      queryParams: { projectId: this.project?.id } 
    });
  }

  manageMembers(): void {
    this.router.navigate(['/dashboard/projects', this.project?.id, 'members']);
  }

  viewTask(taskId: number | undefined): void {
    if (taskId) {
      this.router.navigate(['/dashboard/tasks', taskId, 'view']);
    }
  }

  editTask(taskId: number | undefined): void {
    if (taskId) {
      this.router.navigate(['/dashboard/tasks', taskId, 'edit']);
    }
  }
} 