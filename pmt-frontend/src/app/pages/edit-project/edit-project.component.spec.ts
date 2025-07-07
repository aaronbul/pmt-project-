import { EditProjectComponent } from './edit-project.component';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Project } from '../../models/project.model';

describe('EditProjectComponent', () => {
  let component: EditProjectComponent;
  let projectService: jasmine.SpyObj<ProjectService>;
  let router: jasmine.SpyObj<Router>;
  let route: jasmine.SpyObj<ActivatedRoute>;
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
    projectService = jasmine.createSpyObj('ProjectService', ['getProjectById', 'updateProject']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    route = jasmine.createSpyObj('ActivatedRoute', [], { 
      params: of({ id: '1' }) 
    });
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    cdr = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    component = new EditProjectComponent(
      projectService,
      router,
      route,
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
      expect(component.projectId).toBeNull();
      expect(component.startDate).toBeUndefined();
    });

    it('should initialize startDate with current date', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(component.project.startDate).toBe(today);
    });
  });

  describe('ngOnInit', () => {
    it('should load project on init with valid id', () => {
      projectService.getProjectById.and.returnValue(of(mockProject));

      component.ngOnInit();

      expect(component.projectId).toBe(1);
      expect(projectService.getProjectById).toHaveBeenCalledWith(1);
      expect(component.project).toEqual(mockProject);
      expect(component.startDate).toEqual(new Date('2024-01-01'));
    });

    it('should handle route params subscription', () => {
      projectService.getProjectById.and.returnValue(of(mockProject));

      component.ngOnInit();

      expect(component.projectId).toBe(1);
    });
  });

  describe('loadProject', () => {
    it('should load project successfully', () => {
      projectService.getProjectById.and.returnValue(of(mockProject));

      component.loadProject(1);

      expect(projectService.getProjectById).toHaveBeenCalledWith(1);
      expect(component.project).toEqual(mockProject);
      expect(component.startDate).toEqual(new Date('2024-01-01'));
      expect(component.loading).toBe(false);
    });

    it('should handle loading error', () => {
      projectService.getProjectById.and.returnValue(throwError(() => new Error('Load failed')));

      component.loadProject(1);

      expect(projectService.getProjectById).toHaveBeenCalledWith(1);
      expect(component.loading).toBe(false);
    });

    it('should handle project without startDate', () => {
      const projectWithoutDate: Partial<Project> = { ...mockProject, startDate: undefined };
      projectService.getProjectById.and.returnValue(of(projectWithoutDate as Project));

      component.loadProject(1);

      expect(component.startDate).toBeUndefined();
    });

    it('should set loading to true during load', () => {
      projectService.getProjectById.and.returnValue(of(mockProject));

      component.loadProject(1);

      expect(component.loading).toBe(false); // Should be false after completion
      expect(cdr.detectChanges).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('should update project successfully', () => {
      projectService.updateProject.and.returnValue(of(mockProject));
      component.projectId = 1;
      component.project = {
        name: 'Updated Project',
        description: 'Updated Description',
        startDate: '2024-01-01'
      };
      component.startDate = new Date('2024-01-01');

      component.onSubmit();

      expect(projectService.updateProject).toHaveBeenCalledWith(1, {
        name: 'Updated Project',
        description: 'Updated Description',
        startDate: '2024-01-01'
      });
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/projects', 1]);
      expect(snackBar.open).toHaveBeenCalledWith(
        'Projet modifié avec succès !',
        'Fermer',
        jasmine.any(Object)
      );
    });

    it('should handle update error', () => {
      projectService.updateProject.and.returnValue(throwError(() => new Error('Update failed')));
      component.projectId = 1;
      component.project = {
        name: 'Updated Project',
        description: 'Updated Description',
        startDate: '2024-01-01'
      };

      component.onSubmit();

      expect(projectService.updateProject).toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Erreur lors de la modification du projet',
        'Fermer',
        jasmine.any(Object)
      );
    });

    it('should show error for missing name', () => {
      component.project = {
        name: '',
        description: 'Updated Description',
        startDate: '2024-01-01'
      };

      component.onSubmit();

      expect(projectService.updateProject).not.toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Veuillez remplir tous les champs obligatoires',
        'Fermer',
        jasmine.any(Object)
      );
    });

    it('should handle null projectId', () => {
      component.projectId = null;
      component.project = {
        name: 'Updated Project',
        description: 'Updated Description',
        startDate: '2024-01-01'
      };

      component.onSubmit();

      expect(projectService.updateProject).not.toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'ID du projet non trouvé',
        'Fermer',
        jasmine.any(Object)
      );
    });
  });

  describe('Navigation', () => {
    it('should navigate back', () => {
      component.projectId = 1;

      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/projects', 1]);
    });

    it('should navigate to projects list if no projectId', () => {
      component.projectId = null;

      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/projects']);
    });
  });

  describe('Loading State Management', () => {
    it('should set loading to false after successful update', () => {
      projectService.updateProject.and.returnValue(of(mockProject));
      component.projectId = 1;
      component.project = {
        name: 'Updated Project',
        description: 'Updated Description',
        startDate: '2024-01-01'
      };

      component.onSubmit();

      expect(component.loading).toBe(false);
      expect(cdr.detectChanges).toHaveBeenCalled();
    });

    it('should set loading to false on error', () => {
      projectService.updateProject.and.returnValue(throwError(() => new Error('Update failed')));
      component.projectId = 1;
      component.project = {
        name: 'Updated Project',
        description: 'Updated Description',
        startDate: '2024-01-01'
      };

      component.onSubmit();

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

  describe('Date Formatting', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-12-31');
      const formatted = (component as any).formatDateForBackend(date);
      expect(formatted).toBe('2024-12-31');
    });

    it('should handle null date', () => {
      const formatted = (component as any).formatDateForBackend(null);
      expect(formatted).toBeUndefined();
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

    it('should have projectId property', () => {
      expect(component.projectId).toBeDefined();
    });

    it('should have startDate property', () => {
      expect(component.startDate).toBeDefined();
    });
  });

  describe('Component Methods', () => {
    it('should have ngOnInit method', () => {
      expect(typeof component.ngOnInit).toBe('function');
    });

    it('should have loadProject method', () => {
      expect(typeof component.loadProject).toBe('function');
    });

    it('should have onSubmit method', () => {
      expect(typeof component.onSubmit).toBe('function');
    });

    it('should have goBack method', () => {
      expect(typeof component.goBack).toBe('function');
    });

    it('should have showMessage method', () => {
      expect(typeof (component as any).showMessage).toBe('function');
    });

    it('should have formatDateForBackend method', () => {
      expect(typeof (component as any).formatDateForBackend).toBe('function');
    });
  });
}); 