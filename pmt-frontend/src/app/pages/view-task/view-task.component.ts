import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-view-task',
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
    <div class="view-task-container" *ngIf="task; else loading">
      <div class="header">
        <h1>{{ task.title }}</h1>
        <div class="header-actions">
          <button mat-button (click)="editTask()">
            <mat-icon>edit</mat-icon>
            Modifier
          </button>
          <button mat-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Retour
          </button>
        </div>
      </div>

      <div class="task-details">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Détails de la tâche</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="task-info">
              <div class="info-row">
                <strong>Description:</strong>
                <p>{{ task.description || 'Aucune description' }}</p>
              </div>
              
              <div class="info-row">
                <strong>Projet:</strong>
                <p>{{ task.projectName || 'N/A' }}</p>
              </div>
              
              <div class="info-row">
                <strong>Statut:</strong>
                <mat-chip color="accent" selected>
                  {{ task.statusName || task.status?.name || 'TODO' }}
                </mat-chip>
              </div>
              
              <div class="info-row">
                <strong>Priorité:</strong>
                <mat-chip [color]="getPriorityColor(task.priority)" selected>
                  {{ task.priority }}
                </mat-chip>
              </div>
              
              <div class="info-row" *ngIf="task.assignedToName">
                <strong>Assigné à:</strong>
                <p>{{ task.assignedToName }}</p>
              </div>
              
              <div class="info-row" *ngIf="task.dueDate">
                <strong>Date d'échéance:</strong>
                <p>{{ task.dueDate | date:'dd/MM/yyyy' }}</p>
              </div>
              
              <div class="info-row">
                <strong>Créé le:</strong>
                <p>{{ task.createdAt | date:'dd/MM/yyyy à HH:mm' }}</p>
              </div>
              
              <div class="info-row" *ngIf="task.updatedAt">
                <strong>Modifié le:</strong>
                <p>{{ task.updatedAt | date:'dd/MM/yyyy à HH:mm' }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Chargement de la tâche...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .view-task-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
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
      gap: 8px;
    }

    .task-details {
      margin-bottom: 24px;
    }

    .task-info {
      padding: 16px 0;
    }

    .info-row {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      gap: 12px;
    }

    .info-row strong {
      min-width: 120px;
      color: #333;
    }

    .info-row p {
      margin: 0;
      color: #666;
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

    @media (max-width: 600px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .info-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }

      .info-row strong {
        min-width: auto;
      }
    }
  `]
})
export class ViewTaskComponent implements OnInit {
  task: Task | null = null;
  loading = false;
  taskId: number | undefined = undefined;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.taskId = +params['id'];
      console.log('ViewTaskComponent - taskId reçu:', this.taskId);
      if (this.taskId) {
        this.loadTask(this.taskId);
      } else {
        console.error('ViewTaskComponent - taskId est undefined ou null');
        this.router.navigate(['/dashboard/tasks']);
      }
    });
  }

  loadTask(taskId: number | undefined): void {
    if (!taskId) {
      console.error('ViewTaskComponent - loadTask appelé avec taskId undefined');
      this.router.navigate(['/dashboard/tasks']);
      return;
    }

    console.log('ViewTaskComponent - Chargement de la tâche:', taskId);
    this.loading = true;
    this.cdr.detectChanges();

    this.taskService.getTaskById(taskId).subscribe({
      next: (task) => {
        console.log('ViewTaskComponent - Tâche chargée avec succès:', task);
        this.task = task;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('ViewTaskComponent - Erreur lors du chargement de la tâche:', error);
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/dashboard/tasks']);
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

  editTask(): void {
    if (this.taskId) {
      this.router.navigate(['/dashboard/tasks', this.taskId, 'edit']);
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard/tasks']);
  }
} 