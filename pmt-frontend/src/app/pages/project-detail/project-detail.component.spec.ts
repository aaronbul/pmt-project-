import { ProjectDetailComponent } from './project-detail.component';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';

describe('ProjectDetailComponent', () => {
  let component: ProjectDetailComponent;
  let projectService: jasmine.SpyObj<ProjectService>;
  let taskService: jasmine.SpyObj<TaskService>;
  let route: jasmine.SpyObj<ActivatedRoute>;
  let router: jasmine.SpyObj<Router>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;

  const mockProject: Project = {
    id: 1,
    name: 'Test Project',
    description: 'Test Description',
    startDate: '2024-01-01',
    createdAt: '2024-01-01T00:00:00Z',
    memberCount: 5
  };

  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Task 1 Description',
      statusId: 1,
      priority: 'HIGH',
      projectId: 1,
      createdBy: 1,
      statusName: 'TODO',
      assignedToName: 'User 1',
      dueDate: '2024-12-31'
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Task 2 Description',
      statusId: 1,
      priority: 'MEDIUM',
      projectId: 1,
      createdBy: 1,
      statusName: 'IN_PROGRESS',
      assignedToName: 'User 2',
      dueDate: '2024-12-30'
    }
  ];

  beforeEach(() => {
    projectService = jasmine.createSpyObj('ProjectService', ['getProjectById']);
    taskService = jasmine.createSpyObj('TaskService', ['getTasksByProject']);
    route = jasmine.createSpyObj('ActivatedRoute', [], { 
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    });
    router = jasmine.createSpyObj('Router', ['navigate']);
    cdr = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    component = new ProjectDetailComponent(
      route,
      projectService,
      taskService,
      cdr,
      router
    );
  });

  describe('Initialization', () => {
    it('should create component', () => {
      expect(component).toBeDefined();
    });

    it('should initialize with default values', () => {
      expect(component.project).toBeNull();
      expect(component.tasks).toEqual([]);
      expect(component.loading).toBe(false);
    });
  });

  describe('ngOnInit', () => {
    it('should load project and tasks on init', () => {
      projectService.getProjectById.and.returnValue(of(mockProject));
      taskService.getTasksByProject.and.returnValue(of(mockTasks));

      component.ngOnInit();

      expect(projectService.getProjectById).toHaveBeenCalledWith(1);
      expect(taskService.getTasksByProject).toHaveBeenCalledWith(1);
      expect(component.project).toEqual(mockProject);
      expect(component.tasks).toEqual(mockTasks);
    });

    it('should handle route params subscription', () => {
      projectService.getProjectById.and.returnValue(of(mockProject));
      taskService.getTasksByProject.and.returnValue(of(mockTasks));

      component.ngOnInit();
    });
  });

  describe('loadProject', () => {
    it('should load project successfully', () => {
      projectService.getProjectById.and.returnValue(of(mockProject));

      component.loadProject(1);

      expect(projectService.getProjectById).toHaveBeenCalledWith(1);
      expect(component.project).toEqual(mockProject);
      expect(component.loading).toBe(false);
    });

    it('should handle loading error', () => {
      projectService.getProjectById.and.returnValue(throwError(() => new Error('Load failed')));

      component.loadProject(1);

      expect(projectService.getProjectById).toHaveBeenCalledWith(1);
      expect(component.loading).toBe(false);
    });
  });

  describe('loadProjectTasks', () => {
    it('should load project tasks successfully', () => {
      taskService.getTasksByProject.and.returnValue(of(mockTasks));

      component.loadProjectTasks(1);

      expect(taskService.getTasksByProject).toHaveBeenCalledWith(1);
      expect(component.tasks).toEqual(mockTasks);
    });

    it('should handle loading error', () => {
      taskService.getTasksByProject.and.returnValue(throwError(() => new Error('Load failed')));
      component.loadProjectTasks(1);
      expect(taskService.getTasksByProject).toHaveBeenCalledWith(1);
      expect(component.tasks).toEqual([]);
    });

    it('should handle empty tasks list', () => {
      taskService.getTasksByProject.and.returnValue(of([]));

      component.loadProjectTasks(1);

      expect(component.tasks).toEqual([]);
    });
  });

  describe('Navigation', () => {
    it('should navigate to create new task', () => {
      component.project = mockProject;

      component.createNewTask();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/tasks/create'], {
        queryParams: { projectId: 1 }
      });
    });

    it('should navigate to manage members', () => {
      component.project = mockProject;

      component.manageMembers();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/projects', 1, 'members']);
    });

    it('should navigate to view task', () => {
      component.viewTask(1);

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/tasks', 1, 'view']);
    });

    it('should navigate to edit task', () => {
      component.editTask(1);

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/tasks', 1, 'edit']);
    });

    it('should handle undefined task id for view', () => {
      component.viewTask(undefined);

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should handle undefined task id for edit', () => {
      component.editTask(undefined);

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should navigate back', () => {
      component.navigateBack();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/projects']);
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
      const color = component.getPriorityColor('UNKNOWN');
      expect(color).toBe('primary');
    });
  });

  describe('Project Management', () => {
    it('should handle project with all properties', () => {
      component.project = mockProject;

      expect(component.project.id).toBe(1);
      expect(component.project.name).toBe('Test Project');
      expect(component.project.description).toBe('Test Description');
      expect(component.project.startDate).toBe('2024-01-01');
      expect(component.project.memberCount).toBe(5);
    });

    it('should handle project with minimal properties', () => {
      const minimalProject: Project = {
        name: 'Minimal Project',
        startDate: '2024-01-01'
      };

      component.project = minimalProject;

      expect(component.project.name).toBe('Minimal Project');
      expect(component.project.startDate).toBe('2024-01-01');
      expect(component.project.id).toBeUndefined();
      expect(component.project.description).toBeUndefined();
    });

    it('should handle null project', () => {
      component.project = null;

      expect(component.project).toBeNull();
    });
  });

  describe('Task Management', () => {
    it('should handle tasks with all properties', () => {
      component.tasks = mockTasks;

      expect(component.tasks.length).toBe(2);
      expect(component.tasks[0].title).toBe('Task 1');
      expect(component.tasks[1].title).toBe('Task 2');
      expect(component.tasks[0].priority).toBe('HIGH');
      expect(component.tasks[1].priority).toBe('MEDIUM');
    });

    it('should handle empty tasks list', () => {
      component.tasks = [];

      expect(component.tasks.length).toBe(0);
    });

    it('should handle single task', () => {
      component.tasks = [mockTasks[0]];

      expect(component.tasks.length).toBe(1);
      expect(component.tasks[0].title).toBe('Task 1');
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

    it('should handle loading during project fetch', () => {
      projectService.getProjectById.and.returnValue(of(mockProject));

      component.loadProject(1);

      expect(component.loading).toBe(false); // Should be false after completion
    });
  });

  describe('Component Properties', () => {
    it('should have project property', () => {
      expect(component.project).toBeDefined();
    });

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

    it('should have loadProject method', () => {
      expect(typeof component.loadProject).toBe('function');
    });

    it('should have loadProjectTasks method', () => {
      expect(typeof component.loadProjectTasks).toBe('function');
    });

    it('should have createNewTask method', () => {
      expect(typeof component.createNewTask).toBe('function');
    });

    it('should have manageMembers method', () => {
      expect(typeof component.manageMembers).toBe('function');
    });

    it('should have viewTask method', () => {
      expect(typeof component.viewTask).toBe('function');
    });

    it('should have editTask method', () => {
      expect(typeof component.editTask).toBe('function');
    });

    it('should have getPriorityColor method', () => {
      expect(typeof component.getPriorityColor).toBe('function');
    });
  });
});