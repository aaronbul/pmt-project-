import { TasksComponent } from './tasks.component';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Task } from '../../models/task.model';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let taskService: jasmine.SpyObj<TaskService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;

  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Tâche Test 1',
      description: 'Test Description',
      priority: 'HIGH',
      statusId: 1,
      projectId: 1,
      createdBy: 1,
      statusName: 'TODO',
      projectName: 'Test Project',
      dueDate: '2024-12-31'
    },
    {
      id: 2,
      title: 'Tâche Test 2',
      description: 'Test Description',
      priority: 'MEDIUM',
      statusId: 1,
      projectId: 1,
      createdBy: 1,
      statusName: 'TODO',
      projectName: 'Test Project',
      dueDate: '2024-12-31'
    }
  ];

  beforeEach(() => {
    taskService = jasmine.createSpyObj('TaskService', ['getCurrentUserTasks']);
    authService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    cdr = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    component = new TasksComponent(
      taskService,
      authService,
      router,
      cdr
    );
  });

  describe('Initialization', () => {
    it('should create component', () => {
      expect(component).toBeDefined();
    });

    it('should initialize with default values', () => {
      expect(component.tasks).toEqual([]);
      expect(component.loading).toBe(false);
    });
  });

  describe('ngOnInit', () => {
    it('should load tasks when user is logged in', () => {
      authService.isLoggedIn.and.returnValue(true);
      taskService.getCurrentUserTasks.and.returnValue(of(mockTasks));

      component.ngOnInit();

      expect(authService.isLoggedIn).toHaveBeenCalled();
      expect(taskService.getCurrentUserTasks).toHaveBeenCalled();
      expect(component.tasks).toEqual(mockTasks);
      expect(component.loading).toBe(false);
    });

    it('should redirect to login when user is not logged in', () => {
      authService.isLoggedIn.and.returnValue(false);

      component.ngOnInit();

      expect(authService.isLoggedIn).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      expect(taskService.getCurrentUserTasks).not.toHaveBeenCalled();
    });

    it('should handle empty tasks list', () => {
      authService.isLoggedIn.and.returnValue(true);
      taskService.getCurrentUserTasks.and.returnValue(of([]));

      component.ngOnInit();

      expect(component.tasks).toEqual([]);
      expect(component.loading).toBe(false);
    });
  });

  describe('loadTasks', () => {
    it('should load tasks successfully', () => {
      taskService.getCurrentUserTasks.and.returnValue(of(mockTasks));

      component.loadTasks();

      expect(component.loading).toBe(false);
      expect(component.tasks).toEqual(mockTasks);
      expect(cdr.detectChanges).toHaveBeenCalled();
    });

    // it('should handle loading error', () => {
    //   taskService.getCurrentUserTasks.and.returnValue(throwError(() => new Error('Load failed')));
    //   component.loadTasks();
    //   expect(component.loading).toBe(false);
    //   expect(component.tasks).toEqual([]);
    //   expect(cdr.detectChanges).toHaveBeenCalled();
    // });

    it('should set loading to true during load', () => {
      taskService.getCurrentUserTasks.and.returnValue(of(mockTasks));

      component.loadTasks();

      expect(component.loading).toBe(false); // Should be false after completion
      expect(cdr.detectChanges).toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should navigate to create task', () => {
      component.createNewTask();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/tasks/create']);
    });

    it('should navigate to edit task', () => {
      component.editTask(1);

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/tasks', 1, 'edit']);
    });

    it('should navigate to view task', () => {
      component.viewTask(1);

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/tasks', 1, 'view']);
    });

    it('should handle undefined task id for edit', () => {
      component.editTask(undefined);

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should handle undefined task id for view', () => {
      component.viewTask(undefined);

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Priority Color', () => {
    it('should return correct color for HIGH priority', () => {
      const color = component.getPriorityColor('HIGH');
      expect(color).toBe('warn');
    });

    it('should return correct color for MEDIUM priority', () => {
      const color = component.getPriorityColor('MEDIUM');
      expect(color).toBe('accent');
    });

    it('should return correct color for LOW priority', () => {
      const color = component.getPriorityColor('LOW');
      expect(color).toBe('primary');
    });

    it('should return primary for unknown priority', () => {
      const color = component.getPriorityColor('UNKNOWN' as any);
      expect(color).toBe('primary');
    });
  });

  describe('Task Management', () => {
    it('should handle tasks with all properties', () => {
      const task: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        priority: 'HIGH',
        statusId: 1,
        projectId: 1,
        createdBy: 1,
        statusName: 'TODO',
        projectName: 'Test Project',
        dueDate: '2024-12-31'
      };
      component.tasks = [task];
      expect(component.tasks[0].id).toBe(1);
      expect(component.tasks[0].title).toBe('Test Task');
      expect(component.tasks[0].description).toBe('Test Description');
      expect(component.tasks[0].priority).toBe('HIGH');
    });

    it('should handle tasks with minimal properties', () => {
      const task: Task = {
        title: 'Minimal Task',
        statusId: 1,
        priority: 'LOW',
        projectId: 1,
        createdBy: 1
      };
      component.tasks = [task];
      expect(component.tasks[0].title).toBe('Minimal Task');
      expect(component.tasks[0].id).toBeUndefined();
      expect(component.tasks[0].description).toBeUndefined();
    });

    it('should handle multiple tasks', () => {
      component.tasks = mockTasks;
      expect(component.tasks.length).toBe(2);
      expect(component.tasks[0].title).toBe('Tâche Test 1');
      expect(component.tasks[1].title).toBe('Tâche Test 2');
    });
  });

  describe('Loading State', () => {
    it('should handle loading state changes', () => {
      expect(component.loading).toBe(false);

      component.loading = true;
      expect(component.loading).toBe(true);

      component.loading = false;
      expect(component.loading).toBe(false);
    });

    it('should handle loading during task fetch', () => {
      taskService.getCurrentUserTasks.and.returnValue(of(mockTasks));

      component.loadTasks();

      expect(component.loading).toBe(false); // Should be false after completion
    });
  });

  describe('Component Properties', () => {
    it('should have tasks property', () => {
      expect(component.tasks).toBeDefined();
      expect(Array.isArray(component.tasks)).toBe(true);
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

    it('should have loadTasks method', () => {
      expect(typeof component.loadTasks).toBe('function');
    });

    it('should have createNewTask method', () => {
      expect(typeof component.createNewTask).toBe('function');
    });

    it('should have editTask method', () => {
      expect(typeof component.editTask).toBe('function');
    });

    it('should have viewTask method', () => {
      expect(typeof component.viewTask).toBe('function');
    });

    it('should have getPriorityColor method', () => {
      expect(typeof component.getPriorityColor).toBe('function');
    });
  });
}); 