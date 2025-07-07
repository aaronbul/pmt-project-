import { CreateTaskComponent } from './create-task.component';
import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Task } from '../../models/task.model';
import { Project } from '../../models/project.model';
import { User } from '../../models/user.model';

describe('CreateTaskComponent', () => {
  let component: CreateTaskComponent;
  let taskService: jasmine.SpyObj<TaskService>;
  let projectService: jasmine.SpyObj<ProjectService>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;
  let route: jasmine.SpyObj<ActivatedRoute>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    priority: 'HIGH',
    statusId: 1,
    projectId: 1,
    createdBy: 1,
    assignedTo: 1,
    dueDate: '2024-12-31',
    createdAt: '2024-01-01T00:00:00Z'
  };

  const mockProjects: Project[] = [
    {
      id: 1,
      name: 'Project 1',
      startDate: '2024-01-01'
    },
    {
      id: 2,
      name: 'Project 2',
      startDate: '2024-01-02'
    }
  ];

  const mockUsers: User[] = [
    {
      id: 1,
      username: 'user1',
      email: 'user1@example.com'
    },
    {
      id: 2,
      username: 'user2',
      email: 'user2@example.com'
    }
  ];

  beforeEach(() => {
    taskService = jasmine.createSpyObj('TaskService', ['createTask']);
    projectService = jasmine.createSpyObj('ProjectService', ['getAllProjects']);
    userService = jasmine.createSpyObj('UserService', ['getAllUsers']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    route = jasmine.createSpyObj('ActivatedRoute', [], { params: of({}) });
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    cdr = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    component = new CreateTaskComponent(
      taskService,
      projectService,
      userService,
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
      expect(component.task.title).toBe('');
      expect(component.task.description).toBe('');
      expect(component.task.priority).toBe('MEDIUM');
      expect(component.projects).toEqual([]);
      expect(component.users).toEqual([]);
      expect(component.loading).toBe(false);
    });
  });

  describe('ngOnInit', () => {
    it('should load projects and users on init', () => {
      projectService.getAllProjects.and.returnValue(of(mockProjects));
      userService.getAllUsers.and.returnValue(of(mockUsers));

      component.ngOnInit();

      expect(projectService.getAllProjects).toHaveBeenCalled();
      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(component.projects).toEqual(mockProjects);
      expect(component.users).toEqual(mockUsers);
    });

    it('should handle empty projects list', () => {
      projectService.getAllProjects.and.returnValue(of([]));
      userService.getAllUsers.and.returnValue(of(mockUsers));

      component.ngOnInit();

      expect(component.projects).toEqual([]);
      expect(component.users).toEqual(mockUsers);
    });

    it('should handle empty users list', () => {
      projectService.getAllProjects.and.returnValue(of(mockProjects));
      userService.getAllUsers.and.returnValue(of([]));

      component.ngOnInit();

      expect(component.projects).toEqual(mockProjects);
      expect(component.users).toEqual([]);
    });
  });

  describe('loadProjects', () => {
    it('should load projects successfully', () => {
      projectService.getAllProjects.and.returnValue(of(mockProjects));

      component.loadProjects();

      expect(component.projects).toEqual(mockProjects);
    });

    it('should handle loading error', () => {
      projectService.getAllProjects.and.returnValue(throwError(() => new Error('Load failed')));

      component.loadProjects();

      expect(component.projects).toEqual([]);
    });
  });

  describe('loadUsers', () => {
    it('should load users successfully', () => {
      userService.getAllUsers.and.returnValue(of(mockUsers));

      component.loadUsers();

      expect(component.users).toEqual(mockUsers);
    });

    it('should handle loading error', () => {
      userService.getAllUsers.and.returnValue(throwError(() => new Error('Load failed')));

      component.loadUsers();

      expect(component.users).toEqual([]);
    });
  });

  describe('onSubmit', () => {
    it('should create task successfully', () => {
      taskService.createTask.and.returnValue(of(mockTask));
      component.task = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'HIGH',
        projectId: 1,
        assignedTo: 1,
        dueDate: '2024-12-31'
      };

      component.onSubmit();

      expect(taskService.createTask).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'HIGH',
        projectId: 1,
        assignedTo: 1,
        dueDate: '2024-12-31'
      });
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/tasks']);
      expect(snackBar.open).toHaveBeenCalledWith(
        'Tâche créée avec succès !',
        'Fermer',
        jasmine.any(Object)
      );
    });

    it('should handle creation error', () => {
      taskService.createTask.and.returnValue(throwError(() => new Error('Creation failed')));
      component.task = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'HIGH',
        projectId: 1
      };

      component.onSubmit();

      expect(taskService.createTask).toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Erreur lors de la création de la tâche',
        'Fermer',
        jasmine.any(Object)
      );
    });

    it('should show error for missing title', () => {
      component.task = {
        title: '',
        description: 'Test Description',
        priority: 'HIGH',
        projectId: 1
      };

      component.onSubmit();

      expect(taskService.createTask).not.toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Veuillez remplir tous les champs obligatoires',
        'Fermer',
        jasmine.any(Object)
      );
    });

    it('should show error for missing projectId', () => {
      component.task = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'HIGH'
      };

      component.onSubmit();

      expect(taskService.createTask).not.toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Veuillez remplir tous les champs obligatoires',
        'Fermer',
        jasmine.any(Object)
      );
    });

    it('should show error for missing priority', () => {
      component.task = {
        title: 'Test Task',
        description: 'Test Description',
        projectId: 1
      };

      component.onSubmit();

      expect(taskService.createTask).not.toHaveBeenCalled();
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

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/tasks']);
    });
  });

  describe('Loading State Management', () => {
    it('should set loading to false after successful creation', () => {
      taskService.createTask.and.returnValue(of(mockTask));
      component.task = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'HIGH',
        projectId: 1
      };

      component.onSubmit();

      expect(component.loading).toBe(false);
      expect(cdr.detectChanges).toHaveBeenCalled();
    });

    it('should set loading to false on error', () => {
      taskService.createTask.and.returnValue(throwError(() => new Error('Creation failed')));
      component.task = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'HIGH',
        projectId: 1
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

  describe('Task Management', () => {
    it('should handle task with all properties', () => {
      const task: Task = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'HIGH',
        statusId: 1,
        projectId: 1,
        createdBy: 1,
        assignedTo: 1,
        dueDate: '2024-12-31'
      };
      component.task = task;
      expect(component.task.title).toBe('Test Task');
      expect(component.task.priority).toBe('HIGH');
      expect(component.task.statusId).toBe(1);
      expect(component.task.projectId).toBe(1);
      expect(component.task.createdBy).toBe(1);
    });

    it('should handle task with minimal properties', () => {
      const task: Task = {
        title: 'Minimal Task',
        statusId: 1,
        priority: 'LOW',
        projectId: 1,
        createdBy: 1
      };
      component.task = task;
      expect(component.task.title).toBe('Minimal Task');
      expect(component.task.priority).toBe('LOW');
      expect(component.task.statusId).toBe(1);
      expect(component.task.projectId).toBe(1);
      expect(component.task.createdBy).toBe(1);
    });
  });

  describe('Component Properties', () => {
    it('should have task property', () => {
      expect(component.task).toBeDefined();
      expect(typeof component.task).toBe('object');
    });

    it('should have projects property', () => {
      expect(component.projects).toBeDefined();
      expect(Array.isArray(component.projects)).toBe(true);
    });

    it('should have users property', () => {
      expect(component.users).toBeDefined();
      expect(Array.isArray(component.users)).toBe(true);
    });

    it('should have loading property', () => {
      expect(component.loading).toBeDefined();
      expect(typeof component.loading).toBe('boolean');
    });
  });

  describe('Component Methods', () => {
    it('should have ngOnInit method', () => {
      expect(typeof component.ngOnInit).toBe('function');
    });

    it('should have loadProjects method', () => {
      expect(typeof component.loadProjects).toBe('function');
    });

    it('should have loadUsers method', () => {
      expect(typeof component.loadUsers).toBe('function');
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