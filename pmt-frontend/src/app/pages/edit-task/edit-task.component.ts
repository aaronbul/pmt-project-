import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="edit-task-container">
      <mat-card class="edit-task-card">
        <mat-card-header>
          <mat-card-title>Modifier la tâche</mat-card-title>
          <mat-card-subtitle>Modifiez les détails de la tâche</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form #taskForm="ngForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Titre *</mat-label>
              <input matInput 
                     [(ngModel)]="task.title" 
                     name="title" 
                     required
                     placeholder="Titre de la tâche">
              <mat-icon matSuffix>title</mat-icon>
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
              <mat-label>Assigné à</mat-label>
              <mat-select [(ngModel)]="task.assignedTo" name="assignedTo">
                <mat-option [value]="undefined">Non assigné</mat-option>
                <mat-option *ngFor="let user of users" [value]="user.id">
                  {{ user.username }}
                </mat-option>
              </mat-select>
              <mat-icon matSuffix>person</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Priorité</mat-label>
              <mat-select [(ngModel)]="task.priority" name="priority">
                <mat-option value="LOW">Faible</mat-option>
                <mat-option value="MEDIUM">Moyenne</mat-option>
                <mat-option value="HIGH">Élevée</mat-option>
                <mat-option value="URGENT">Urgente</mat-option>
              </mat-select>
              <mat-icon matSuffix>priority_high</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Statut</mat-label>
              <mat-select [(ngModel)]="taskStatus" name="status">
                <mat-option value="TODO">À faire</mat-option>
                <mat-option value="IN_PROGRESS">En cours</mat-option>
                <mat-option value="REVIEW">En révision</mat-option>
                <mat-option value="DONE">Terminé</mat-option>
                <mat-option value="CANCELLED">Annulé</mat-option>
              </mat-select>
              <mat-icon matSuffix>flag</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Date d'échéance</mat-label>
              <input matInput 
                     [matDatepicker]="dueDatePicker"
                     [(ngModel)]="dueDate" 
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
                <mat-icon *ngIf="!loading">save</mat-icon>
                <span *ngIf="loading">Modification...</span>
                <span *ngIf="!loading">Modifier la tâche</span>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .edit-task-container {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      padding: 20px;
      background-color: #fafafa;
    }

    .edit-task-card {
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
export class EditTaskComponent implements OnInit {
  task: Partial<Task> = {
    title: '',
    description: '',
    priority: 'MEDIUM',
    projectId: undefined,
    assignedTo: undefined,
    dueDate: undefined
  };
  users: any[] = [];
  loading = false;
  taskId: number | null = null;
  taskStatus: string = 'TODO';
  dueDate: Date | undefined;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    
    // Récupérer l'ID de la tâche depuis l'URL
    this.route.params.subscribe(params => {
      this.taskId = +params['id'];
      if (this.taskId) {
        this.loadTask(this.taskId);
      }
    });
  }

  loadTask(taskId: number): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.taskService.getTaskById(taskId).subscribe({
      next: (task) => {
        this.task = {
          ...task,
          assignedTo: task.assignedToId, // Utiliser assignedToId pour le formulaire
          dueDate: task.dueDate
        };
        this.taskStatus = task.statusName || task.status?.name || 'TODO';
        this.dueDate = task.dueDate ? new Date(task.dueDate) : undefined;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Erreur lors du chargement de la tâche:', error);
        this.showMessage('Erreur lors du chargement de la tâche', 'error');
        this.router.navigate(['/dashboard/tasks']);
      }
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        console.log('Utilisateurs chargés:', users);
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
    if (!this.task.title || !this.taskId) {
      this.showMessage('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    // Préparer les données pour la mise à jour
    const updateData: Partial<Task> = {
      title: this.task.title,
      description: this.task.description,
      priority: this.task.priority,
      status: { name: this.taskStatus },
      assignedTo: this.task.assignedTo,
      dueDate: this.dueDate ? this.formatDateForBackend(this.dueDate) : undefined
    };

    console.log('Données préparées dans le composant:', updateData);

    this.taskService.updateTask(this.taskId, updateData).subscribe({
      next: (updatedTask) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.showMessage('Tâche modifiée avec succès !', 'success');
        
        // Utiliser setTimeout pour éviter l'erreur ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.router.navigate(['/dashboard/tasks']);
        }, 100);
      },
      error: (error) => {
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Erreur lors de la modification de la tâche:', error);
        this.showMessage('Erreur lors de la modification de la tâche', 'error');
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