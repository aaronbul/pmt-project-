import { CreateProjectComponent } from './create-project.component';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';
import { Project } from '../../models/project.model';

describe('CreateProjectComponent', () => {
  let component: CreateProjectComponent;
  let projectService: jasmine.SpyObj<ProjectService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;

  const mockProject: Project = {
    id: 1,
    name: 'Test Project',
    description: 'Test Description',
    startDate: '2024-01-01',
    createdAt: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    projectService = jasmine.createSpyObj('ProjectService', ['createProject']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    cdr = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    component = new CreateProjectComponent(
      projectService,
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
      expect(component.project.name).toBe('');
      expect(component.project.description).toBe('');
      expect(component.project.startDate).toBeDefined();
      expect(component.loading).toBe(false);
    });

    it('should initialize startDate with current date', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(component.project.startDate).toBe(today);
    });
  });

  describe('onSubmit', () => {
    it('should create project successfully', () => {
      projectService.createProject.and.returnValue(of(mockProject));
      component.project = {
        name: 'Test Project',
        description: 'Test Description',
        startDate: '2024-01-01'
      };

      component.onSubmit();

      expect(projectService.createProject).toHaveBeenCalledWith({
        name: 'Test Project',
        description: 'Test Description',
        startDate: '2024-01-01'
      });
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/projects']);
      expect(snackBar.open).toHaveBeenCalledWith(
        'Projet créé avec succès !',
        'Fermer',
        jasmine.any(Object)
      );
    });

    // it('should handle creation error', () => {
    //   projectService.createProject.and.returnValue(throwError(() => new Error('Creation failed')));
    //   component.project = {
    //     name: 'Test Project',
    //     description: 'Test Description',
    //     startDate: '2024-01-01'
    //   };
    //
    //   component.onSubmit();
    //
    //   expect(projectService.createProject).toHaveBeenCalled();
    //   expect(snackBar.open).toHaveBeenCalledWith(
    //     'Erreur lors de la création du projet',
    //     'Fermer',
    //     jasmine.any(Object)
    //   );
    // });

    it('should show error for missing name', () => {
      component.project = {
        name: '',
        description: 'Test Description',
        startDate: '2024-01-01'
      };

      component.onSubmit();

      expect(projectService.createProject).not.toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Veuillez remplir tous les champs obligatoires',
        'Fermer',
        jasmine.any(Object)
      );
    });

    it('should show error for missing startDate', () => {
      component.project = {
        name: 'Test Project',
        description: 'Test Description',
        startDate: ''
      };

      component.onSubmit();

      expect(projectService.createProject).not.toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Veuillez remplir tous les champs obligatoires',
        'Fermer',
        jasmine.any(Object)
      );
    });

    it('should show error for missing name and startDate', () => {
      component.project = {
        name: '',
        description: 'Test Description',
        startDate: ''
      };

      component.onSubmit();

      expect(projectService.createProject).not.toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Veuillez remplir tous les champs obligatoires',
        'Fermer',
        jasmine.any(Object)
      );
    });
  });

  describe('Navigation', () => {
    it('should navigate back', () => {
      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/projects']);
    });
  });

  describe('Loading State Management', () => {
    it('should set loading to false after successful creation', () => {
      projectService.createProject.and.returnValue(of(mockProject));
      component.project = {
        name: 'Test Project',
        description: 'Test Description',
        startDate: '2024-01-01'
      };

      component.onSubmit();

      expect(component.loading).toBe(false);
      expect(cdr.detectChanges).toHaveBeenCalled();
    });

    // it('should set loading to false on error', () => {
    //   projectService.createProject.and.returnValue(throwError(() => new Error('Creation failed')));
    //   component.project = {
    //     name: 'Test Project',
    //     description: 'Test Description',
    //     startDate: '2024-01-01'
    //   };
    //
    //   component.onSubmit();
    //
    //   expect(component.loading).toBe(false);
    //   expect(cdr.detectChanges).toHaveBeenCalled();
    // });
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

  describe('Project Management', () => {
    it('should handle project with all properties', () => {
      const project = {
        name: 'Test Project',
        description: 'Test Description',
        startDate: '2024-01-01'
      };

      component.project = project;

      expect(component.project.name).toBe('Test Project');
      expect(component.project.description).toBe('Test Description');
      expect(component.project.startDate).toBe('2024-01-01');
    });

    it('should handle project with minimal properties', () => {
      const project = {
        name: 'Minimal Project',
        startDate: '2024-01-01'
      };

      component.project = project;

      expect(component.project.name).toBe('Minimal Project');
      expect(component.project.startDate).toBe('2024-01-01');
      expect(component.project.description).toBeUndefined();
    });

    it('should allow updating project properties', () => {
      component.project.name = 'Updated Project';
      component.project.description = 'Updated Description';
      component.project.startDate = '2024-02-01';

      expect(component.project.name).toBe('Updated Project');
      expect(component.project.description).toBe('Updated Description');
      expect(component.project.startDate).toBe('2024-02-01');
    });
  });

  describe('Component Properties', () => {
    it('should have project property', () => {
      expect(component.project).toBeDefined();
      expect(typeof component.project).toBe('object');
    });

    it('should have loading property', () => {
      expect(component.loading).toBeDefined();
      expect(typeof component.loading).toBe('boolean');
    });
  });

  describe('Component Methods', () => {
    it('should have onSubmit method', () => {
      expect(typeof component.onSubmit).toBe('function');
    });

    it('should have goBack method', () => {
      expect(typeof component.goBack).toBe('function');
    });

    it('should have showMessage method', () => {
      expect(typeof (component as any).showMessage).toBe('function');
    });
  });
}); 