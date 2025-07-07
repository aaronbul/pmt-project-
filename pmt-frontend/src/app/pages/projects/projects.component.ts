import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-projects',
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
    <div class="projects-container">
      <div class="header">
        <h1>Mes Projets</h1>
        <button mat-raised-button color="primary" (click)="createNewProject()">
          <mat-icon>add</mat-icon>
          Nouveau Projet
        </button>
      </div>

      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Chargement des projets...</p>
      </div>

      <div class="projects-grid" *ngIf="!loading && projects.length > 0">
        <mat-card *ngFor="let project of projects" class="project-card">
          <mat-card-header>
            <mat-card-title>{{ project.name }}</mat-card-title>
            <mat-card-subtitle>
              Créé le {{ project.createdAt | date:'dd/MM/yyyy' }}
            </mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <p>{{ project.description || 'Aucune description' }}</p>
            <div class="project-meta">
              <mat-chip color="primary" selected>
                {{ project.memberCount || 0 }} membres
              </mat-chip>
            </div>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-button color="primary" (click)="viewProject(project.id!)" [disabled]="!project.id">
              <mat-icon>visibility</mat-icon>
              Voir
            </button>
            <button mat-button (click)="editProject(project.id!)" [disabled]="!project.id">
              <mat-icon>edit</mat-icon>
              Modifier
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div *ngIf="!loading && projects.length === 0" class="no-projects">
        <mat-icon class="no-projects-icon">folder_open</mat-icon>
        <h2>Aucun projet</h2>
        <p>Vous n'avez pas encore de projets. Créez votre premier projet pour commencer !</p>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          Créer un projet
        </button>
      </div>
    </div>
  `,
  styles: [`
    .projects-container {
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

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .project-card {
      height: fit-content;
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }

    .project-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .project-meta {
      margin-top: 16px;
    }

    .no-projects {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-projects-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .no-projects h2 {
      margin: 16px 0;
      color: #333;
    }

    .no-projects p {
      margin-bottom: 24px;
      font-size: 16px;
    }
  `]
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Charger les projets immédiatement
    this.loadProjects();
    
    // Écouter les changements de route pour recharger les projets
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadProjects();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProjects(): void {
    this.loading = true;
    this.cdr.detectChanges();
    
    this.projectService.getAllProjects().pipe(takeUntil(this.destroy$)).subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des projets:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewProject(projectId: number): void {
    if (projectId) {
      this.router.navigate(['/dashboard/projects', projectId]);
    }
  }

  createNewProject(): void {
    this.router.navigate(['/dashboard/projects/create']);
  }

  editProject(projectId: number): void {
    if (projectId) {
      this.router.navigate(['/dashboard/projects', projectId, 'edit']);
    }
  }
} 