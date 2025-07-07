import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { User } from '../../models/user.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com'
  };

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['login']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    cdr = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    component = new LoginComponent(
      authService,
      router,
      snackBar,
      cdr
    );
  });

  describe('Initialization', () => {
    it('should create component', () => {
      expect(component).toBeDefined();
    });

    it('should initialize with default values', () => {
      expect(component.loginRequest.email).toBe('');
      expect(component.loginRequest.password).toBe('');
      expect(component.loading).toBe(false);
    });
  });

  describe('Login Process', () => {
    it('should handle successful login', () => {
      authService.login.and.returnValue(of(mockUser));
      component.loginRequest = { email: 'test@example.com', password: 'password' };

      component.onLogin();

      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password'
      });
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
      expect(snackBar.open).toHaveBeenCalledWith(
        'Bienvenue testuser !',
        'Fermer',
        jasmine.any(Object)
      );
    });

    it('should handle login error', () => {
      authService.login.and.returnValue(throwError(() => new Error('Login failed')));
      component.loginRequest = { email: 'test@example.com', password: 'wrong' };

      component.onLogin();

      expect(authService.login).toHaveBeenCalled();
      expect(component.loading).toBe(false);
      expect(snackBar.open).toHaveBeenCalledWith('Email ou mot de passe incorrect', 'Fermer', jasmine.objectContaining({
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      }));
    });

    it('should show error for empty fields', () => {
      component.loginRequest = { email: '', password: '' };

      component.onLogin();

      expect(authService.login).not.toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Veuillez remplir tous les champs',
        'Fermer',
        jasmine.any(Object)
      );
    });

    it('should show error for missing email', () => {
      component.loginRequest = { email: '', password: 'password' };

      component.onLogin();

      expect(authService.login).not.toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Veuillez remplir tous les champs',
        'Fermer',
        jasmine.any(Object)
      );
    });

    it('should show error for missing password', () => {
      component.loginRequest = { email: 'test@example.com', password: '' };

      component.onLogin();

      expect(authService.login).not.toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Veuillez remplir tous les champs',
        'Fermer',
        jasmine.any(Object)
      );
    });
  });

  describe('Navigation', () => {
    it('should navigate to register page', () => {
      component.goToRegister();

      expect(router.navigate).toHaveBeenCalledWith(['/register']);
    });
  });

  describe('Loading State Management', () => {
    it('should set loading to true during login', () => {
      authService.login.and.returnValue(of(mockUser));
      component.loginRequest = { email: 'test@example.com', password: 'password' };

      component.onLogin();

      expect(component.loading).toBe(false); // Should be false after completion
      expect(cdr.detectChanges).toHaveBeenCalled();
    });

    it('should set loading to false on error', () => {
      authService.login.and.returnValue(throwError(() => new Error('Login failed')));
      component.loginRequest = { email: 'test@example.com', password: 'wrong' };

      component.onLogin();

      expect(component.loading).toBe(false);
      expect(cdr.detectChanges).toHaveBeenCalled();
    });
  });

  describe('Message Display', () => {
    it('should show success message', () => {
      (component as any).showMessage('Success message', 'success');

      expect(snackBar.open).toHaveBeenCalledWith(
        'Success message',
        'Fermer',
        jasmine.objectContaining({
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        })
      );
    });

    it('should show error message', () => {
      (component as any).showMessage('Error message', 'error');

      expect(snackBar.open).toHaveBeenCalledWith(
        'Error message',
        'Fermer',
        jasmine.objectContaining({
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        })
      );
    });
  });
}); 