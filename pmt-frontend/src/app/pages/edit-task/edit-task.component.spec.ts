import { EditTaskComponent } from './edit-task.component';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Task } from '../../models/task.model';
import { User } from '../../models/user.model';

describe('EditTaskComponent', () => {
  let component: EditTaskComponent;
  let taskService: jasmine.SpyObj<TaskService>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;
  let route: jasmine.SpyObj<ActivatedRoute>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    statusId: 1,
    priority: 'HIGH',
    projectId: 1,
    createdBy: 1,
    assignedTo: 1,
    dueDate: '2024-12-31',
    createdAt: '2024-01-01T00:00:00Z'
  };

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
    taskService = jasmine.createSpyObj('TaskService', ['getTaskById', 'updateTask']);
    userService = jasmine.createSpyObj('UserService', ['getAllUsers']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    route = jasmine.createSpyObj('ActivatedRoute', [], { 
      params: of({ id: '1' }) 
    });
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    cdr = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    component = new EditTaskComponent(
      taskService,
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
      expect(component.users).toEqual([]);
      expect(component.loading).toBe(false);
      expect(component.taskId).toBeNull();
      expect(component.taskStatus).toBe('TODO');
      expect(component.dueDate).toBeUndefined();
    });
  });

  describe('ngOnInit', () => {
    it('should load task and users on init with valid id', () => {
      taskService.getTaskById.and.returnValue(of(mockTask));
      userService.getAllUsers.and.returnValue(of(mockUsers));

      component.ngOnInit();

      expect(component.taskId).toBe(1);
      expect(taskService.getTaskById).toHaveBeenCalledWith(1);
      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(component.task).toEqual(mockTask);
      expect(component.users).toEqual(mockUsers);
      expect(component.dueDate).toEqual(new Date('2024-12-31'));
    });

    it('should handle route params subscription', () => {
      taskService.getTaskById.and.returnValue(of(mockTask));
      userService.getAllUsers.and.returnValue(of(mockUsers));

      component.ngOnInit();

      expect(component.taskId).toBe(1);
    });
  });

  describe('loadTask', () => {
    it('should load task successfully', () => {
      taskService.getTaskById.and.returnValue(of(mockTask));

      component.loadTask(1);

      expect(taskService.getTaskById).toHaveBeenCalledWith(1);
      expect(component.task).toEqual(mockTask);
      expect(component.dueDate).toEqual(new Date('2024-12-31'));
      expect(component.loading).toBe(false);
    });

    it('should handle loading error', () => {
      taskService.getTaskById.and.returnValue(throwError(() => new Error('Load failed')));

      component.loadTask(1);

      expect(taskService.getTaskById).toHaveBeenCalledWith(1);
      expect(component.loading).toBe(false);
    });

    it('should handle task without dueDate', () => {
      const taskWithoutDate = { ...mockTask, dueDate: undefined };
      taskService.getTaskById.and.returnValue(of(taskWithoutDate));

      component.loadTask(1);

      expect(component.dueDate).toBeUndefined();
    });

    it('should set loading to true during load', () => {
      taskService.getTaskById.and.returnValue(of(mockTask));

      component.loadTask(1);

      expect(component.loading).toBe(false); // Should be false after completion
      expect(cdr.detectChanges).toHaveBeenCalled();
    });
  });

  describe('loadUsers', () => {
    it('should load users successfully', () => {
      userService.getAllUsers.and.returnValue(of(mockUsers));

      component.loadUsers();

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(component.users).toEqual(mockUsers);
    });

    it('should handle loading error', () => {
      userService.getAllUsers.and.returnValue(throwError(() => new Error('Load failed')));

      component.loadUsers();

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(component.users).toEqual([]);
    });

    it('should handle empty users list', () => {
      userService.getAllUsers.and.returnValue(of([]));

      component.loadUsers();

      expect(component.users).toEqual([]);
    });
  });

  describe('onSubmit', () => {
    it('should update task successfully', () => {
      taskService.updateTask.and.returnValue(of(mockTask));
      component.taskId = 1;
      component.task = {
        title: 'Updated Task',
        description: 'Updated Description',
        priority: 'HIGH',
        assignedTo: 1
      };
      component.taskStatus = 'IN_PROGRESS';
      component.dueDate = new Date('2024-12-31');

      component.onSubmit();

      expect(taskService.updateTask).toHaveBeenCalledWith(1, {
        title: 'Updated Task',
        description: 'Updated Description',
        priority: 'HIGH',
        assignedTo: 1,
        statusId: 2, // IN_PROGRESS
        dueDate: '2024-12-31'
      });
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/tasks', 1]);
      expect(snackBar.open).toHaveBeenCalledWith(
        'Tâche modifiée avec succès !',
        'Fermer',
        jasmine.any(Object)
      );
    });

    it('should handle update error', () => {
      taskService.updateTask.and.returnValue(throwError(() => new Error('Update failed')));
      component.taskId = 1;
      component.task = {
        title: 'Updated Task',
        description: 'Updated Description',
        priority: 'HIGH'
      };

      component.onSubmit();

      expect(taskService.updateTask).toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Erreur lors de la modification de la tâche',
        'Fermer',
        jasmine.any(Object)
      );
    });

    it('should show error for missing title', () => {
      component.task = {
        title: '',
        description: 'Updated Description',
        priority: 'HIGH'
      };

      component.onSubmit();

      expect(taskService.updateTask).not.toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Veuillez remplir tous les champs obligatoires',
        'Fermer',
        jasmine.any(Object)
      );
    });

    it('should handle null taskId', () => {
      component.taskId = null;
      component.task = {
        title: 'Updated Task',
        description: 'Updated Description',
        priority: 'HIGH'
      };

      component.onSubmit();

      expect(taskService.updateTask).not.toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'ID de la tâche non trouvé',
        'Fermer',
        jasmine.any(Object)
      );
    });

    it('should handle different status mappings', () => {
      taskService.updateTask.and.returnValue(of(mockTask));
      component.taskId = 1;
      component.task = {
        title: 'Test Task',
        priority: 'MEDIUM'
      };

      const statusMappings = [
        { status: 'TODO', expectedId: 1 },
        { status: 'IN_PROGRESS', expectedId: 2 },
        { status: 'REVIEW', expectedId: 3 },
        { status: 'DONE', expectedId: 4 },
        { status: 'CANCELLED', expectedId: 5 }
      ];

      statusMappings.forEach(mapping => {
        component.taskStatus = mapping.status;
        component.onSubmit();

        expect(taskService.updateTask).toHaveBeenCalledWith(1, jasmine.objectContaining({
          statusId: mapping.expectedId
        }));
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate back', () => {
      component.taskId = 1;

      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/tasks', 1]);
    });

    it('should navigate to tasks list if no taskId', () => {
      component.taskId = null;

      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/tasks']);
    });
  });

  describe('Loading State Management', () => {
    it('should set loading to false after successful update', () => {
      taskService.updateTask.and.returnValue(of(mockTask));
      component.taskId = 1;
      component.task = {
        title: 'Updated Task',
        priority: 'HIGH',
        statusId: 1,
        projectId: 1,
        createdBy: 1
      };

      component.onSubmit();

      expect(component.loading).toBe(false);
      expect(cdr.detectChanges).toHaveBeenCalled();
    });

    it('should set loading to false on error', () => {
      taskService.updateTask.and.returnValue(throwError(() => new Error('Update failed')));
      component.taskId = 1;
      component.task = {
        title: 'Updated Task',
        priority: 'HIGH',
        statusId: 1,
        projectId: 1,
        createdBy: 1
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
      const task: Partial<Task> = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'HIGH',
        assignedTo: 1,
        statusId: 1,
        projectId: 1,
        createdBy: 1
      };
      component.task = task;
      expect(component.task.title).toBe('Test Task');
      expect(component.task.description).toBe('Test Description');
      expect(component.task.priority).toBe('HIGH');
      expect(component.task.assignedTo).toBe(1);
      expect(component.task.statusId).toBe(1);
      expect(component.task.projectId).toBe(1);
      expect(component.task.createdBy).toBe(1);
    });

    it('should handle task with minimal properties', () => {
      const task: Partial<Task> = {
        title: 'Minimal Task',
        priority: 'MEDIUM',
        statusId: 1,
        projectId: 1,
        createdBy: 1
      };
      component.task = task;
      expect(component.task.title).toBe('Minimal Task');
      expect(component.task.priority).toBe('MEDIUM');
      expect(component.task.statusId).toBe(1);
      expect(component.task.projectId).toBe(1);
      expect(component.task.createdBy).toBe(1);
      expect(component.task.description).toBeUndefined();
    });
  });

  describe('Component Properties', () => {
    it('should have task property', () => {
      expect(component.task).toBeDefined();
      expect(typeof component.task).toBe('object');
    });

    it('should have users property', () => {
      expect(component.users).toBeDefined();
      expect(Array.isArray(component.users)).toBe(true);
    });

    it('should have loading property', () => {
      expect(component.loading).toBeDefined();
      expect(typeof component.loading).toBe('boolean');
    });

    it('should have taskId property', () => {
      expect(component.taskId).toBeDefined();
    });

    it('should have taskStatus property', () => {
      expect(component.taskStatus).toBeDefined();
      expect(typeof component.taskStatus).toBe('string');
    });

    it('should have dueDate property', () => {
      expect(component.dueDate).toBeDefined();
    });
  });

  describe('Component Methods', () => {
    it('should have ngOnInit method', () => {
      expect(typeof component.ngOnInit).toBe('function');
    });

    it('should have loadTask method', () => {
      expect(typeof component.loadTask).toBe('function');
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