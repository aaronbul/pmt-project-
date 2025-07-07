import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { Task } from '../../models/task.model';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule
  ],
  template: `
    <div class="create-task-container">
      <mat-card class="create-task-card">
        <mat-card-header>
          <mat-card-title>Créer une nouvelle tâche</mat-card-title>
          <mat-card-subtitle>Remplissez les informations pour créer votre tâche</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form (ngSubmit)="onSubmit()" #taskForm="ngForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Titre de la tâche</mat-label>
              <input matInput 
                     [(ngModel)]="task.title" 
                     name="title"
                     required
                     placeholder="Titre de la tâche">
              <mat-icon matSuffix>assignment</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput 
                        [(ngModel)]="task.description" 
                        name="description"
                        rows="4"
                        placeholder="Description détaillée de la tâche"></textarea>
              <mat-icon matSuffix>description</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Projet</mat-label>
              <mat-select [(ngModel)]="task.projectId" name="projectId" required>
                <mat-option *ngFor="let project of projects" [value]="project.id">
                  {{ project.name }}
                </mat-option>
              </mat-select>
              <mat-icon matSuffix>folder</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Priorité</mat-label>
              <mat-select [(ngModel)]="task.priority" name="priority" required>
                <mat-option value="LOW">Basse</mat-option>
                <mat-option value="MEDIUM">Moyenne</mat-option>
                <mat-option value="HIGH">Haute</mat-option>
                <mat-option value="URGENT">Urgente</mat-option>
              </mat-select>
              <mat-icon matSuffix>priority_high</mat-icon>
            </mat-form-field>

                         <mat-form-field appearance="outline" class="full-width">
               <mat-label>Assigner à</mat-label>
               <mat-select [(ngModel)]="task.assignedTo" name="assignedTo">
                 <mat-option [value]="undefined">Non assigné</mat-option>
                 <mat-option *ngFor="let user of users" [value]="user.id">
                   {{ user.username }}
                 </mat-option>
               </mat-select>
               <mat-icon matSuffix>person</mat-icon>
             </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Date d'échéance</mat-label>
              <input matInput 
                     [matDatepicker]="dueDatePicker"
                     [(ngModel)]="task.dueDate" 
                     name="dueDate">
              <mat-datepicker-toggle matSuffix [for]="dueDatePicker"></mat-datepicker-toggle>
              <mat-datepicker #dueDatePicker></mat-datepicker>
              <mat-icon matSuffix>event</mat-icon>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button 
                      type="button" 
                      (click)="goBack()"
                      [disabled]="loading">
                <mat-icon>arrow_back</mat-icon>
                Annuler
              </button>
              
              <button mat-raised-button 
                      color="primary" 
                      type="submit" 
                      [disabled]="loading || !taskForm.valid">
                <mat-icon *ngIf="!loading">add</mat-icon>
                <span *ngIf="loading">Création...</span>
                <span *ngIf="!loading">Créer la tâche</span>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .create-task-container {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      padding: 20px;
      background-color: #fafafa;
    }

    .create-task-card {
      max-width: 600px;
      width: 100%;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    mat-card-header {
      text-align: center;
      margin-bottom: 20px;
    }

    mat-card-title {
      font-size: 24px;
      font-weight: 500;
      color: #333;
    }

    mat-card-subtitle {
      color: #666;
    }

    mat-card-content {
      margin-bottom: 20px;
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      gap: 16px;
    }

    .form-actions button {
      flex: 1;
      height: 48px;
      font-size: 16px;
    }

    @media (max-width: 600px) {
      .form-actions {
        flex-direction: column;
      }
      
      .form-actions button {
        width: 100%;
      }
    }
  `]
})
export class CreateTaskComponent implements OnInit {
  task: Partial<Task> = {
    title: '',
    description: '',
    priority: 'MEDIUM',
    projectId: undefined,
    assignedTo: undefined,
    dueDate: undefined
  };
  projects: Project[] = [];
  users: any[] = []; // TODO: Créer un modèle User
  loading = false;

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadUsers();
    
    // Si on vient d'un projet spécifique, pré-sélectionner ce projet
    this.route.queryParams.subscribe(params => {
      if (params['projectId']) {
        this.task.projectId = +params['projectId'];
      }
    });
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des projets:', error);
      }
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        console.log('Utilisateurs chargés pour création de tâche:', users);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        // En cas d'erreur, utiliser des données fictives comme fallback
        this.users = [
          { id: 1, username: 'john.doe' },
          { id: 2, username: 'jane.smith' },
          { id: 3, username: 'bob.wilson' }
        ];
      }
    });
  }

  onSubmit(): void {
    if (!this.task.title || !this.task.projectId) {
      this.showMessage('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    // Convertir la date si elle existe
    if (this.task.dueDate) {
      const date = new Date(this.task.dueDate);
      this.task.dueDate = this.formatDateForBackend(date);
    }

    // Log des données avant envoi
    console.log('Données de la tâche avant création:', {
      title: this.task.title,
      description: this.task.description,
      priority: this.task.priority,
      projectId: this.task.projectId,
      assignedTo: this.task.assignedTo,
      dueDate: this.task.dueDate
    });

    this.taskService.createTask(this.task).subscribe({
      next: (createdTask) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.showMessage('Tâche créée avec succès !', 'success');
        
        // Utiliser setTimeout pour éviter l'erreur ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.router.navigate(['/dashboard/tasks']);
        }, 100);
      },
      error: (error) => {
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Erreur lors de la création de la tâche:', error);
        this.showMessage('Erreur lors de la création de la tâche', 'error');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/tasks']);
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    // Utiliser setTimeout pour éviter les conflits avec le cycle de détection de changement
    setTimeout(() => {
      this.snackBar.open(message, 'Fermer', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
      });
    }, 0);
  }

  private formatDateForBackend(date: Date): string {
    // Utiliser le fuseau horaire local pour éviter le décalage
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
} 