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

import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Inscription PMT</mat-card-title>
          <mat-card-subtitle>Créer un nouveau compte</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form (ngSubmit)="onRegister()" #registerForm="ngForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nom d'utilisateur</mat-label>
              <input matInput 
                     [(ngModel)]="user.username" 
                     name="username"
                     required
                     placeholder="Votre nom d'utilisateur">
              <mat-icon matSuffix>person</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput 
                     type="email" 
                     [(ngModel)]="user.email" 
                     name="email"
                     required
                     placeholder="votre@email.com">
              <mat-icon matSuffix>email</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Mot de passe</mat-label>
              <input matInput 
                     type="password" 
                     [(ngModel)]="user.password" 
                     name="password"
                     required
                     placeholder="Votre mot de passe">
              <mat-icon matSuffix>lock</mat-icon>
            </mat-form-field>

            <button mat-raised-button 
                    color="primary" 
                    type="submit" 
                    class="full-width"
                    [disabled]="loading || !registerForm.valid">
              <mat-icon *ngIf="!loading">person_add</mat-icon>
              <span *ngIf="loading">Inscription...</span>
              <span *ngIf="!loading">S'inscrire</span>
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <button mat-button 
                  type="button" 
                  (click)="goToLogin()"
                  class="full-width">
            Déjà un compte ? Se connecter
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .register-card {
      max-width: 400px;
      width: 100%;
      padding: 20px;
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

    mat-card-actions {
      padding: 0;
    }

    button[type="submit"] {
      height: 48px;
      font-size: 16px;
      margin-top: 16px;
    }
  `]
})
export class RegisterComponent {
  user: User = {
    username: '',
    email: '',
    password: ''
  };
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  onRegister(): void {
    if (!this.user.username || !this.user.email || !this.user.password) {
      this.showMessage('Veuillez remplir tous les champs', 'error');
      return;
    }

    this.loading = true;
    this.changeDetectorRef.detectChanges();
    
    this.authService.register(this.user).subscribe({
      next: (user) => {
        this.loading = false;
        this.changeDetectorRef.detectChanges();
        this.showMessage('Compte créé avec succès ! Vous pouvez maintenant vous connecter.', 'success');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.loading = false;
        this.changeDetectorRef.detectChanges();
        console.error('Erreur d\'inscription:', error);
        
        // Afficher le message d'erreur spécifique du backend
        let errorMessage = 'Erreur lors de la création du compte';
        if (error.error) {
          errorMessage = error.error;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.showMessage(errorMessage, 'error');
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
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