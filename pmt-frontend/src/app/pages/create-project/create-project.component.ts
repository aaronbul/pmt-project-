import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-create-project',
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
    MatNativeDateModule
  ],
  template: `
    <div class="create-project-container">
      <mat-card class="create-project-card">
        <mat-card-header>
          <mat-card-title>Créer un nouveau projet</mat-card-title>
          <mat-card-subtitle>Remplissez les informations pour créer votre projet</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form (ngSubmit)="onSubmit()" #projectForm="ngForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nom du projet</mat-label>
              <input matInput 
                     [(ngModel)]="project.name" 
                     name="name"
                     required
                     placeholder="Nom de votre projet">
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
                     [(ngModel)]="project.startDate" 
                     name="startDate"
                     required>
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
                <mat-icon *ngIf="!loading">add</mat-icon>
                <span *ngIf="loading">Création...</span>
                <span *ngIf="!loading">Créer le projet</span>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .create-project-container {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      padding: 20px;
      background-color: #fafafa;
    }

    .create-project-card {
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
export class CreateProjectComponent {
  project: Partial<Project> = {
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0]
  };
  loading = false;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit(): void {
    if (!this.project.name || !this.project.startDate) {
      this.showMessage('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    this.projectService.createProject(this.project).subscribe({
      next: (createdProject) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.showMessage('Projet créé avec succès !', 'success');
        this.router.navigate(['/dashboard/projects']);
      },
      error: (error) => {
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Erreur lors de la création du projet:', error);
        this.showMessage('Erreur lors de la création du projet', 'error');
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
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }
} 