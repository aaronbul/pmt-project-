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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="edit-project-container">
      <mat-card class="edit-project-card">
        <mat-card-header>
          <mat-card-title>Modifier le projet</mat-card-title>
          <mat-card-subtitle>Modifiez les détails du projet</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form #projectForm="ngForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nom du projet *</mat-label>
              <input matInput 
                     [(ngModel)]="project.name" 
                     name="name" 
                     required
                     placeholder="Nom du projet">
              <mat-icon matSuffix>folder</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput 
                        [(ngModel)]="project.description" 
                        name="description"
                        rows="4"
                        placeholder="Description détaillée du projet"></textarea>
              <mat-icon matSuffix>description</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Date de début</mat-label>
              <input matInput 
                     [matDatepicker]="startDatePicker"
                     [(ngModel)]="startDate" 
                     name="startDate">
              <mat-datepicker-toggle matSuffix [for]="startDatePicker"></mat-datepicker-toggle>
              <mat-datepicker #startDatePicker></mat-datepicker>
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
                      [disabled]="loading || !projectForm.valid">
                <mat-icon *ngIf="!loading">save</mat-icon>
                <span *ngIf="loading">Modification...</span>
                <span *ngIf="!loading">Modifier le projet</span>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .edit-project-container {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      padding: 20px;
      background-color: #fafafa;
    }

    .edit-project-card {
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
export class EditProjectComponent implements OnInit {
  project: Partial<Project> = {
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0]
  };
  loading = false;
  projectId: number | null = null;
  startDate: Date | undefined;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = +params['id'];
      if (this.projectId) {
        this.loadProject(this.projectId);
      }
    });
  }

  loadProject(projectId: number): void {
    this.loading = true;
    this.cdr.detectChanges();
    
    this.projectService.getProjectById(projectId).subscribe({
      next: (project) => {
        this.project = { ...project };
        if (project.startDate) {
          this.startDate = new Date(project.startDate);
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement du projet:', error);
        this.showMessage('Erreur lors du chargement du projet', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (!this.projectId) {
      this.showMessage('ID du projet manquant', 'error');
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    // Préparer les données pour l'envoi
    const projectData = {
      name: this.project.name || '',
      description: this.project.description || '',
      startDate: this.startDate ? this.formatDateForBackend(this.startDate) : new Date().toISOString().split('T')[0]
    };

    this.projectService.updateProject(this.projectId, projectData).subscribe({
      next: (updatedProject) => {
        this.showMessage('Projet modifié avec succès', 'success');
        setTimeout(() => {
          this.router.navigate(['/dashboard/projects', this.projectId]);
        }, 1000);
      },
      error: (error) => {
        console.error('Erreur lors de la modification du projet:', error);
        this.showMessage('Erreur lors de la modification du projet', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/projects']);
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }

  private formatDateForBackend(date: Date | null): string {
    if (!date) {
      return new Date().toISOString().split('T')[0];
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
} 