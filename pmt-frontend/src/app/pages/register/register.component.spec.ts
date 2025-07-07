import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { User } from '../../models/user.model';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
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
    authService = jasmine.createSpyObj('AuthService', ['register']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    cdr = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    component = new RegisterComponent(
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
      expect(component.user.username).toBe('');
      expect(component.user.email).toBe('');
      expect(component.user.password).toBe('');
      expect(component.loading).toBe(false);
    });
  });

  describe('Registration Process', () => {
    it('should handle successful registration', () => {
      authService.register.and.returnValue(of(mockUser));
      component.user = { 
        username: 'testuser', 
        email: 'test@example.com', 
        password: 'password' 
      };

      component.onRegister();

      expect(authService.register).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password'
      });
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      expect(snackBar.open).toHaveBeenCalledWith(
        'Compte créé avec succès ! Vous pouvez maintenant vous connecter.',
        'Fermer',
        jasmine.any(Object)
      );
    });

    it('should handle registration error with error.error', () => {
      const error = { error: 'Email already exists' };
      authService.register.and.returnValue(throwError(() => error));
      component.user = { 
        username: 'testuser', 
        email: 'test@example.com', 
        password: 'password' 
      };

      component.onRegister();

      expect(authService.register).toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Email already exists',
        'Fermer',
        jasmine.any(Object)
      );
    });

    it('should handle registration error with error.message', () => {
      const error = { message: 'Network error' };
      authService.register.and.returnValue(throwError(() => error));
      component.user = { 
        username: 'testuser', 
        email: 'test@example.com', 
        password: 'password' 
      };

      component.onRegister();

      expect(authService.register).toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Network error',
        'Fermer',
        jasmine.any(Object)
      );
    });

    it('should handle registration error with generic error', () => {
      const error = {};
      authService.register.and.returnValue(throwError(() => error));
      component.user = { 
        username: 'testuser', 
        email: 'test@example.com', 
        password: 'password' 
      };

      component.onRegister();

      expect(authService.register).toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Erreur lors de la création du compte',
        'Fermer',
        jasmine.any(Object)
      );
    });

    it('should show error for empty fields', () => {
      component.user = { username: '', email: '', password: '' };

      component.onRegister();

      expect(authService.register).not.toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Veuillez remplir tous les champs',
        'Fermer',
        jasmine.any(Object)
      );
    });

    it('should show error for missing username', () => {
      component.user = { username: '', email: 'test@example.com', password: 'password' };

      component.onRegister();

      expect(authService.register).not.toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Veuillez remplir tous les champs',
        'Fermer',
        jasmine.any(Object)
      );
    });

    it('should show error for missing email', () => {
      component.user = { username: 'testuser', email: '', password: 'password' };

      component.onRegister();

      expect(authService.register).not.toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Veuillez remplir tous les champs',
        'Fermer',
        jasmine.any(Object)
      );
    });

    it('should show error for missing password', () => {
      component.user = { username: 'testuser', email: 'test@example.com', password: '' };

      component.onRegister();

      expect(authService.register).not.toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Veuillez remplir tous les champs',
        'Fermer',
        jasmine.any(Object)
      );
    });
  });

  describe('Navigation', () => {
    it('should navigate to login page', () => {
      component.goToLogin();

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('Loading State Management', () => {
    it('should set loading to false after successful registration', () => {
      authService.register.and.returnValue(of(mockUser));
      component.user = { 
        username: 'testuser', 
        email: 'test@example.com', 
        password: 'password' 
      };

      component.onRegister();

      expect(component.loading).toBe(false);
      expect(cdr.detectChanges).toHaveBeenCalled();
    });

    it('should set loading to false on error', () => {
      authService.register.and.returnValue(throwError(() => new Error('Registration failed')));
      component.user = { 
        username: 'testuser', 
        email: 'test@example.com', 
        password: 'password' 
      };

      component.onRegister();

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