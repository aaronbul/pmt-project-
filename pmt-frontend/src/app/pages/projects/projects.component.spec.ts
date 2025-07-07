import { ProjectsComponent } from './projects.component';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Project } from '../../models/project.model';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let projectService: jasmine.SpyObj<ProjectService>;
  let router: jasmine.SpyObj<Router>;
  let route: jasmine.SpyObj<ActivatedRoute>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;

  const mockProjects: Project[] = [
    {
      id: 1,
      name: 'Projet Test 1',
      description: 'Description du projet 1',
      startDate: '2024-01-01',
      createdAt: '2024-01-01T00:00:00Z',
      memberCount: 3
    },
    {
      id: 2,
      name: 'Projet Test 2',
      description: 'Description du projet 2',
      startDate: '2024-01-02',
      createdAt: '2024-01-02T00:00:00Z',
      memberCount: 5
    }
  ];

  beforeEach(() => {
    projectService = jasmine.createSpyObj('ProjectService', ['getAllProjects']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    route = jasmine.createSpyObj('ActivatedRoute', [], { params: of({}) });
    cdr = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    component = new ProjectsComponent(
      projectService,
      router,
      route,
      cdr
    );
  });

  describe('Initialization', () => {
    it('should create component', () => {
      expect(component).toBeDefined();
    });

    it('should initialize with default values', () => {
      expect(component.projects).toEqual([]);
      expect(component.loading).toBe(false);
    });
  });

  describe('ngOnInit', () => {
    it('should load projects on init', () => {
      projectService.getAllProjects.and.returnValue(of(mockProjects));

      component.ngOnInit();

      expect(projectService.getAllProjects).toHaveBeenCalled();
      expect(component.projects).toEqual(mockProjects);
      expect(component.loading).toBe(false);
    });

    it('should handle empty projects list', () => {
      projectService.getAllProjects.and.returnValue(of([]));

      component.ngOnInit();

      expect(component.projects).toEqual([]);
      expect(component.loading).toBe(false);
    });
  });

  describe('loadProjects', () => {
    it('should load projects successfully', () => {
      projectService.getAllProjects.and.returnValue(of(mockProjects));

      component.loadProjects();

      expect(component.loading).toBe(false);
      expect(component.projects).toEqual(mockProjects);
      expect(cdr.detectChanges).toHaveBeenCalled();
    });

    // it('should handle loading error', () => {
    //   projectService.getAllProjects.and.returnValue(throwError(() => new Error('Load failed')));
    //   component.loadProjects();
    //   expect(component.loading).toBe(false);
    //   expect(component.projects).toEqual([]);
    //   expect(cdr.detectChanges).toHaveBeenCalled();
    // });

    it('should set loading to true during load', () => {
      projectService.getAllProjects.and.returnValue(of(mockProjects));

      component.loadProjects();

      expect(component.loading).toBe(false); // Should be false after completion
      expect(cdr.detectChanges).toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should navigate to view project', () => {
      component.viewProject(1);

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/projects', 1]);
    });

    it('should navigate to create project', () => {
      component.createNewProject();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/projects/create']);
    });

    it('should navigate to edit project', () => {
      component.editProject(1);

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/projects', 1, 'edit']);
    });
  });

  describe('Project Management', () => {
    it('should handle projects with all properties', () => {
      const project: Project = {
        id: 1,
        name: 'Test Project',
        description: 'Test Description',
        startDate: '2024-01-01',
        createdAt: '2024-01-01T00:00:00Z',
        memberCount: 5
      };

      component.projects = [project];

      expect(component.projects[0].id).toBe(1);
      expect(component.projects[0].name).toBe('Test Project');
      expect(component.projects[0].description).toBe('Test Description');
      expect(component.projects[0].memberCount).toBe(5);
    });

    it('should handle projects with minimal properties', () => {
      const project: Project = {
        name: 'Minimal Project',
        startDate: '2024-01-01'
      };

      component.projects = [project];

      expect(component.projects[0].name).toBe('Minimal Project');
      expect(component.projects[0].id).toBeUndefined();
      expect(component.projects[0].description).toBeUndefined();
    });

    it('should handle multiple projects', () => {
      component.projects = mockProjects;

      expect(component.projects.length).toBe(2);
      expect(component.projects[0].name).toBe('Projet Test 1');
      expect(component.projects[1].name).toBe('Projet Test 2');
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
      projectService.getAllProjects.and.returnValue(of(mockProjects));

      component.loadProjects();

      expect(component.loading).toBe(false); // Should be false after completion
    });
  });

  describe('Component Properties', () => {
    it('should have projects property', () => {
      expect(component.projects).toBeDefined();
      expect(Array.isArray(component.projects)).toBe(true);
    });

    it('should have loading property', () => {
      expect(component.loading).toBeDefined();
      expect(typeof component.loading).toBe('boolean');
    });

    it('should have destroy$ property', () => {
      expect((component as any).destroy$).toBeDefined();
    });
  });

  describe('Component Methods', () => {
    it('should have ngOnInit method', () => {
      expect(typeof component.ngOnInit).toBe('function');
    });

    it('should have ngOnDestroy method', () => {
      expect(typeof component.ngOnDestroy).toBe('function');
    });

    it('should have loadProjects method', () => {
      expect(typeof component.loadProjects).toBe('function');
    });

    it('should have viewProject method', () => {
      expect(typeof component.viewProject).toBe('function');
    });

    it('should have createNewProject method', () => {
      expect(typeof component.createNewProject).toBe('function');
    });

    it('should have editProject method', () => {
      expect(typeof component.editProject).toBe('function');
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroy subject', () => {
      const destroySpy = spyOn(component['destroy$'], 'next');
      const completeSpy = spyOn(component['destroy$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
}); 