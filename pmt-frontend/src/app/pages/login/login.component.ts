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
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
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
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Connexion PMT</mat-card-title>
          <mat-card-subtitle>Project Management Tool</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form (ngSubmit)="onLogin()" #loginForm="ngForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput 
                     type="email" 
                     [(ngModel)]="loginRequest.email" 
                     name="email"
                     required
                     placeholder="votre@email.com">
              <mat-icon matSuffix>email</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Mot de passe</mat-label>
              <input matInput 
                     type="password" 
                     [(ngModel)]="loginRequest.password" 
                     name="password"
                     required
                     placeholder="Votre mot de passe">
              <mat-icon matSuffix>lock</mat-icon>
            </mat-form-field>

            <button mat-raised-button 
                    color="primary" 
                    type="submit" 
                    class="full-width"
                    [disabled]="loading || !loginForm.valid">
              <mat-icon *ngIf="!loading">login</mat-icon>
              <span *ngIf="loading">Connexion...</span>
              <span *ngIf="!loading">Se connecter</span>
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <button mat-button 
                  type="button" 
                  (click)="goToRegister()"
                  class="full-width">
            Pas encore de compte ? S'inscrire
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
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
export class LoginComponent {
  loginRequest: LoginRequest = {
    email: '',
    password: ''
  };
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  onLogin(): void {
    if (!this.loginRequest.email || !this.loginRequest.password) {
      this.showMessage('Veuillez remplir tous les champs', 'error');
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();
    
    this.authService.login(this.loginRequest).subscribe({
      next: (user) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.showMessage(`Bienvenue ${user.username} !`, 'success');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Erreur de connexion:', error);
        this.showMessage('Email ou mot de passe incorrect', 'error');
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
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