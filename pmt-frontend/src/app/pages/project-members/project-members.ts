import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

import { ProjectService } from '../../services/project.service';
import { RoleService } from '../../services/role.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Project, ProjectMember, Role } from '../../models/project.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-project-members',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTableModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="project-members-container" *ngIf="project; else loading">
      <!-- En-tête -->
      <div class="header">
        <div>
          <h1>Membres du projet</h1>
          <p class="project-name">{{ project.name }}</p>
        </div>
        <button mat-raised-button color="basic" (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          Retour
        </button>
      </div>

      <!-- Messages -->
      <div class="messages" *ngIf="message || errorMessage">
        <div class="success-message" *ngIf="message">
          <mat-icon>check_circle</mat-icon>
          {{ message }}
        </div>
        <div class="error-message" *ngIf="errorMessage">
          <mat-icon>error</mat-icon>
          {{ errorMessage }}
        </div>
      </div>

      <!-- Formulaire d'ajout de membre -->
      <mat-card class="add-member-card" *ngIf="canManage">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>person_add</mat-icon>
            Ajouter un membre
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Utilisateur</mat-label>
              <mat-select [(ngModel)]="newMember.userId" [disabled]="loadingUsers">
                <mat-option value="0">Sélectionner un utilisateur</mat-option>
                <mat-option 
                  *ngFor="let user of users" 
                  [value]="user.id"
                  [disabled]="isUserAlreadyMember(user.id)">
                  {{ user.username }} ({{ user.email }})
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Rôle</mat-label>
              <mat-select [(ngModel)]="newMember.roleId" [disabled]="loadingRoles">
                <mat-option value="0">Sélectionner un rôle</mat-option>
                <mat-option 
                  *ngFor="let role of roles" 
                  [value]="role.id">
                  {{ role.name }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <button 
              mat-raised-button 
              color="primary" 
              (click)="addMember()"
              [disabled]="!newMember.userId || !newMember.roleId"
              class="add-button">
              <mat-icon>add</mat-icon>
              Ajouter
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Liste des membres -->
      <mat-card class="members-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>people</mat-icon>
            Membres du projet
            <mat-chip color="primary" selected>{{ members.length }}</mat-chip>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <!-- Chargement des membres -->
          <div class="loading-container" *ngIf="loadingMembers">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Chargement des membres...</p>
          </div>

          <!-- Tableau des membres -->
          <div *ngIf="!loadingMembers">
            <table mat-table [dataSource]="members" class="members-table">
              <!-- Colonne Utilisateur -->
              <ng-container matColumnDef="user">
                <th mat-header-cell *matHeaderCellDef>Utilisateur</th>
                <td mat-cell *matCellDef="let member">
                  <div class="user-info">
                    <mat-icon class="user-icon">person</mat-icon>
                    <div>
                      <div class="username">{{ getUserName(member.userId) }}</div>
                      <div class="email">{{ getUserEmail(member.userId) }}</div>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Colonne Rôle -->
              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef>Rôle</th>
                <td mat-cell *matCellDef="let member">
                  <mat-chip 
                    [color]="getRoleColor(member.roleId)" 
                    selected>
                    {{ getRoleName(member.roleId) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Colonne Date d'ajout -->
              <ng-container matColumnDef="joinedAt">
                <th mat-header-cell *matHeaderCellDef>Date d'ajout</th>
                <td mat-cell *matCellDef="let member">
                  <span class="date">{{ member.joinedAt | date:'dd/MM/yyyy HH:mm' }}</span>
                </td>
              </ng-container>

              <!-- Colonne Actions -->
              <ng-container matColumnDef="actions" *ngIf="canManage">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let member">
                  <div class="actions">
                    <button mat-icon-button [matMenuTriggerFor]="roleMenu" color="primary">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <mat-menu #roleMenu="matMenu">
                      <button 
                        mat-menu-item 
                        *ngFor="let role of roles"
                        (click)="updateMemberRole(member.id!, role.id!)"
                        [class.active-role]="member.roleId === role.id">
                        <mat-icon *ngIf="member.roleId === role.id">check</mat-icon>
                        {{ role.name }}
                      </button>
                    </mat-menu>
                    
                    <button 
                      mat-icon-button 
                      color="warn"
                      (click)="removeMember(member.id!)"
                      matTooltip="Retirer du projet">
                      <mat-icon>person_remove</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <!-- Message si aucun membre -->
            <div class="no-members" *ngIf="members.length === 0">
              <mat-icon class="no-members-icon">people_outline</mat-icon>
              <h3>Aucun membre</h3>
              <p>Ce projet n'a pas encore de membres.</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Informations sur les rôles -->
      <mat-card class="roles-info-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>info</mat-icon>
            Informations sur les rôles
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="roles-info">
            <div class="role-info">
              <mat-chip color="warn" selected>ADMIN</mat-chip>
              <p>Peut gérer les membres et toutes les tâches</p>
            </div>
            <div class="role-info">
              <mat-chip color="primary" selected>MEMBER</mat-chip>
              <p>Peut créer et gérer les tâches</p>
            </div>
            <div class="role-info">
              <mat-chip color="accent" selected>OBSERVER</mat-chip>
              <p>Peut seulement visualiser les tâches</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>

    <ng-template #loading>
      <div class="loading-container">
        <mat-spinner diameter="60"></mat-spinner>
        <p>Chargement du projet...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .project-members-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .header h1 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 2rem;
    }

    .project-name {
      margin: 0;
      color: #666;
      font-size: 1.1rem;
    }

    .messages {
      margin-bottom: 24px;
    }

    .success-message, .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 8px;
    }

    .success-message {
      background-color: #e8f5e8;
      color: #2e7d32;
      border: 1px solid #c8e6c9;
    }

    .error-message {
      background-color: #ffebee;
      color: #c62828;
      border: 1px solid #ffcdd2;
    }

    .add-member-card {
      margin-bottom: 24px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      align-items: flex-end;
    }

    .form-field {
      flex: 1;
    }

    .add-button {
      height: 56px;
      min-width: 120px;
    }

    .members-card {
      margin-bottom: 24px;
    }

    .members-table {
      width: 100%;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-icon {
      color: #666;
    }

    .username {
      font-weight: 500;
      color: #333;
    }

    .email {
      font-size: 0.875rem;
      color: #666;
    }

    .date {
      font-size: 0.875rem;
      color: #666;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .active-role {
      background-color: #e3f2fd;
    }

    .no-members {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .no-members-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .no-members h3 {
      margin: 16px 0;
      color: #333;
    }

    .roles-info-card {
      margin-bottom: 24px;
    }

    .roles-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .role-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .role-info p {
      margin: 0;
      font-size: 0.875rem;
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
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .project-members-container {
        padding: 16px;
      }

      .header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .form-row {
        flex-direction: column;
        gap: 16px;
      }

      .add-button {
        width: 100%;
      }

      .roles-info {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProjectMembersComponent implements OnInit {
  projectId: number = 0;
  project: Project | null = null;
  members: ProjectMember[] = [];
  roles: Role[] = [];
  users: User[] = [];
  
  // Formulaire d'ajout de membre
  newMember = {
    userId: 0,
    roleId: 0
  };
  
  // État de chargement
  loading = true;
  loadingMembers = true;
  loadingRoles = true;
  loadingUsers = true;
  
  // Messages
  message = '';
  errorMessage = '';

  // Colonnes du tableau
  displayedColumns: string[] = ['user', 'role', 'joinedAt'];
  
  // Cache pour les permissions
  canManage = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private roleService: RoleService,
    private userService: UserService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.projectId) {
      this.loadProject();
      this.loadMembers();
      this.loadRoles();
      this.loadUsers();
    }
  }

  loadProject(): void {
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (project) => {
        this.project = project;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement du projet:', error);
        this.errorMessage = 'Erreur lors du chargement du projet';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadMembers(): void {
    this.loadingMembers = true;
    this.cdr.detectChanges();
    this.projectService.getProjectMembers(this.projectId).subscribe({
      next: (members) => {
        this.members = members;
        this.loadingMembers = false;
        
        // Mettre à jour les colonnes après le chargement des membres
        this.updateDisplayedColumns();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des membres:', error);
        this.errorMessage = 'Erreur lors du chargement des membres';
        this.loadingMembers = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateDisplayedColumns(): void {
    // Réinitialiser les colonnes
    this.displayedColumns = ['user', 'role', 'joinedAt'];
    
    // Mettre à jour le cache des permissions
    this.canManage = this.canManageMembers();
    
    // Ajouter la colonne actions si l'utilisateur peut gérer les membres
    if (this.canManage) {
      this.displayedColumns.push('actions');
    }
  }

  loadRoles(): void {
    this.loadingRoles = true;
    this.cdr.detectChanges();
    this.roleService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.loadingRoles = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des rôles:', error);
        this.errorMessage = 'Erreur lors du chargement des rôles';
        this.loadingRoles = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadUsers(): void {
    this.loadingUsers = true;
    this.cdr.detectChanges();
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loadingUsers = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        this.errorMessage = 'Erreur lors du chargement des utilisateurs';
        this.loadingUsers = false;
        this.cdr.detectChanges();
      }
    });
  }

  addMember(): void {
    if (!this.newMember.userId || !this.newMember.roleId) {
      this.errorMessage = 'Veuillez sélectionner un utilisateur et un rôle';
      this.cdr.detectChanges();
      return;
    }

    // Vérifier si l'utilisateur est déjà membre
    const existingMember = this.members.find(m => m.userId === this.newMember.userId);
    if (existingMember) {
      this.errorMessage = 'Cet utilisateur est déjà membre du projet';
      this.cdr.detectChanges();
      return;
    }

    const projectMember: ProjectMember = {
      projectId: this.projectId,
      userId: this.newMember.userId,
      roleId: this.newMember.roleId
    };

    this.projectService.addProjectMember(projectMember).subscribe({
      next: (member) => {
        // Créer une nouvelle référence du tableau pour forcer la détection de changements
        this.members = [...this.members, member];
        this.message = 'Membre ajouté avec succès';
        this.errorMessage = '';
        this.newMember = { userId: 0, roleId: 0 };
        
        // Mettre à jour les permissions et colonnes
        this.updateDisplayedColumns();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.message = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du membre:', error);
        this.errorMessage = 'Erreur lors de l\'ajout du membre';
        this.cdr.detectChanges();
      }
    });
  }

  updateMemberRole(memberId: number, roleId: number): void {
    this.projectService.updateMemberRole(memberId, roleId).subscribe({
      next: (updatedMember) => {
        const index = this.members.findIndex(m => m.id === memberId);
        if (index !== -1) {
          // Créer une nouvelle référence du tableau pour forcer la détection de changements
          this.members = [...this.members.slice(0, index), updatedMember, ...this.members.slice(index + 1)];
        }
        this.message = 'Rôle mis à jour avec succès';
        this.errorMessage = '';
        
        // Mettre à jour les permissions et colonnes
        this.updateDisplayedColumns();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.message = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du rôle:', error);
        this.errorMessage = 'Erreur lors de la mise à jour du rôle';
        this.cdr.detectChanges();
      }
    });
  }

  removeMember(memberId: number): void {
    if (confirm('Êtes-vous sûr de vouloir retirer ce membre du projet ?')) {
      this.projectService.deleteProjectMember(memberId).subscribe({
        next: () => {
          this.members = this.members.filter(m => m.id !== memberId);
          this.message = 'Membre retiré avec succès';
          this.errorMessage = '';
          
          // Mettre à jour les permissions et colonnes
          this.updateDisplayedColumns();
          this.cdr.detectChanges();
          setTimeout(() => {
            this.message = '';
            this.cdr.detectChanges();
          }, 3000);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du membre:', error);
          this.errorMessage = 'Erreur lors de la suppression du membre';
          this.cdr.detectChanges();
        }
      });
    }
  }

  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.username : 'Utilisateur inconnu';
  }

  getUserEmail(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.email : '';
  }

  getRoleName(roleId: number): string {
    const role = this.roles.find(r => r.id === roleId);
    return role ? role.name : 'Rôle inconnu';
  }

  getRoleColor(roleId: number): string {
    switch (roleId) {
      case 1: return 'warn'; // ADMIN
      case 2: return 'primary'; // MEMBER
      case 3: return 'accent'; // OBSERVER
      default: return 'primary';
    }
  }

  isUserAlreadyMember(userId: number | undefined): boolean {
    if (userId === undefined) return false;
    return this.members.some(m => m.userId === userId);
  }

  canManageMembers(): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || this.members.length === 0) return false;
    
    const currentMember = this.members.find(m => m.userId === currentUser.id);
    return currentMember?.roleId === 1; // ADMIN role
  }

  goBack(): void {
    this.router.navigate(['/dashboard/projects']);
  }
}
