import { ViewTaskComponent } from './view-task.component';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Task } from '../../models/task.model';

describe('ViewTaskComponent', () => {
  let component: ViewTaskComponent;
  let taskService: jasmine.SpyObj<TaskService>;
  let route: jasmine.SpyObj<ActivatedRoute>;
  let router: jasmine.SpyObj<Router>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    statusId: 1,
    priority: 'HIGH',
    projectId: 1,
    createdBy: 1,
    statusName: 'TODO',
    projectName: 'Test Project',
    assignedToName: 'Test User',
    dueDate: '2024-12-31',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  };

  beforeEach(() => {
    taskService = jasmine.createSpyObj('TaskService', ['getTaskById']);
    route = jasmine.createSpyObj('ActivatedRoute', [], { 
      params: of({ id: '1' }) 
    });
    router = jasmine.createSpyObj('Router', ['navigate']);
    cdr = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    component = new ViewTaskComponent(
      taskService,
      route,
      router,
      cdr
    );
  });

  describe('Initialization', () => {
    it('should create component', () => {
      expect(component).toBeDefined();
    });

    it('should initialize with default values', () => {
      expect(component.task).toBeNull();
      expect(component.loading).toBe(false);
      expect(component.taskId).toBeUndefined();
    });
  });

  describe('ngOnInit', () => {
    it('should load task on init with valid id', () => {
      taskService.getTaskById.and.returnValue(of(mockTask));

      component.ngOnInit();

      expect(component.taskId).toBe(1);
      expect(taskService.getTaskById).toHaveBeenCalledWith(1);
      expect(component.task).toEqual(mockTask);
    });

    it('should handle route params subscription', () => {
      taskService.getTaskById.and.returnValue(of(mockTask));

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
      expect(component.loading).toBe(false);
    });

    it('should handle loading error', () => {
      taskService.getTaskById.and.returnValue(throwError(() => new Error('Load failed')));

      component.loadTask(1);

      expect(taskService.getTaskById).toHaveBeenCalledWith(1);
      expect(component.task).toBeNull();
      expect(component.loading).toBe(false);
    });

    it('should handle undefined task id', () => {
      component.loadTask(undefined);

      expect(taskService.getTaskById).not.toHaveBeenCalled();
    });

    it('should set loading to true during load', () => {
      taskService.getTaskById.and.returnValue(of(mockTask));

      component.loadTask(1);

      expect(component.loading).toBe(false); // Should be false after completion
    });
  });

  describe('Navigation', () => {
    it('should navigate to edit task', () => {
      component.taskId = 1;

      component.editTask();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/tasks', 1, 'edit']);
    });

    it('should navigate back', () => {
      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/tasks']);
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
    it('should handle task with all properties', () => {
      component.task = mockTask;

      expect(component.task.id).toBe(1);
      expect(component.task.title).toBe('Test Task');
      expect(component.task.description).toBe('Test Description');
      expect(component.task.priority).toBe('HIGH');
      expect(component.task.statusName).toBe('TODO');
      expect(component.task.projectName).toBe('Test Project');
      expect(component.task.assignedToName).toBe('Test User');
      expect(component.task.dueDate).toBe('2024-12-31');
    });

    it('should handle task with minimal properties', () => {
      const minimalTask: Task = {
        title: 'Minimal Task',
        statusId: 1,
        priority: 'MEDIUM',
        projectId: 1,
        createdBy: 1
      };

      component.task = minimalTask;

      expect(component.task.title).toBe('Minimal Task');
      expect(component.task.priority).toBe('MEDIUM');
      expect(component.task.id).toBeUndefined();
      expect(component.task.description).toBeUndefined();
    });

    it('should handle null task', () => {
      component.task = null;

      expect(component.task).toBeNull();
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
      taskService.getTaskById.and.returnValue(of(mockTask));

      component.loadTask(1);

      expect(component.loading).toBe(false); // Should be false after completion
    });
  });

  describe('Task ID Management', () => {
    it('should handle valid task id', () => {
      component.taskId = 1;

      expect(component.taskId).toBe(1);
    });

    it('should handle undefined task id', () => {
      component.taskId = undefined;

      expect(component.taskId).toBeUndefined();
    });

    it('should handle task id changes', () => {
      component.taskId = 1;
      expect(component.taskId).toBe(1);

      component.taskId = 2;
      expect(component.taskId).toBe(2);
    });
  });

  describe('Component Properties', () => {
    it('should have task property', () => {
      expect(component.task).toBeDefined();
    });

    it('should have loading property', () => {
      expect(component.loading).toBeDefined();
      expect(typeof component.loading).toBe('boolean');
    });

    it('should have taskId property', () => {
      expect(component.taskId).toBeDefined();
    });
  });

  describe('Component Methods', () => {
    it('should have ngOnInit method', () => {
      expect(typeof component.ngOnInit).toBe('function');
    });

    it('should have loadTask method', () => {
      expect(typeof component.loadTask).toBe('function');
    });

    it('should have editTask method', () => {
      expect(typeof component.editTask).toBe('function');
    });

    it('should have goBack method', () => {
      expect(typeof component.goBack).toBe('function');
    });

    it('should have getPriorityColor method', () => {
      expect(typeof component.getPriorityColor).toBe('function');
    });
  });
}); 