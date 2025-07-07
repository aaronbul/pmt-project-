import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';
import { User } from '../../models/user.model';
import { Notification } from '../../models/notification.model';
import { TestBed } from '@angular/core/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let authService: jasmine.SpyObj<AuthService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: any;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;
  let drawer: any;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com'
  };

  const mockNotifications: Notification[] = [
    {
      id: 1,
      title: 'Test notification 1',
      message: 'Test notification 1',
      type: 'info',
      isRead: false,
      createdAt: '2024-01-01T00:00:00Z',
      userId: 1
    },
    {
      id: 2,
      title: 'Test notification 2',
      message: 'Test notification 2',
      type: 'info',
      isRead: true,
      createdAt: '2024-01-01T00:00:00Z',
      userId: 1
    }
  ];

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'logout']);
    notificationService = jasmine.createSpyObj('NotificationService', ['getUnreadNotifications']);
    router = { navigate: jasmine.createSpy('navigate'), url: '/dashboard' };
    cdr = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    drawer = { close: jasmine.createSpy('close'), toggle: jasmine.createSpy('toggle') };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
      ]
    });

    component = new DashboardComponent(
      authService,
      notificationService,
      router,
      cdr
    );

    component.drawer = drawer;
  });

  describe('Initialization', () => {
    it('should create component', () => {
      expect(component).toBeDefined();
    });

    it('should initialize with default values', () => {
      expect(component.currentUser).toBeNull();
      expect(component.unreadCount).toBe(0);
    });
  });

  describe('ngOnInit', () => {
    it('should load current user and unread notifications on init', () => {
      authService.getCurrentUser.and.returnValue(mockUser);
      notificationService.getUnreadNotifications.and.returnValue(of(mockNotifications.filter(n => !n.isRead)));

      component.ngOnInit();

      expect(authService.getCurrentUser).toHaveBeenCalled();
      expect(notificationService.getUnreadNotifications).toHaveBeenCalled();
      expect(component.currentUser).toEqual(mockUser);
    });

    it('should handle null current user', () => {
      authService.getCurrentUser.and.returnValue(null);
      notificationService.getUnreadNotifications.and.returnValue(of([]));

      component.ngOnInit();

      expect(component.currentUser).toBeNull();
      expect(component.unreadCount).toBe(0);
    });
  });

  describe('Logout', () => {
    it('should call auth service logout and navigate to login', () => {
      component.logout();

      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('Sidenav Management', () => {
    it('should toggle sidenav', () => {
      component.toggleSidenav();

      expect(component.drawer.toggle).toHaveBeenCalled();
    });

    it('should close sidenav', () => {
      component.closeSidenav();

      expect(component.drawer.close).toHaveBeenCalled();
    });

    it('should handle null drawer', () => {
      component.drawer = null;
      expect(() => component.toggleSidenav()).not.toThrow();
    });
  });

  describe('Navigation', () => {
    it('should navigate to projects', () => {
      component.navigateToProjects();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/projects']);
    });

    it('should navigate to tasks', () => {
      component.navigateToTasks();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/tasks']);
    });

    it('should navigate to notifications', () => {
      component.navigateToNotifications();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/notifications']);
    });
  });

  describe('Route Active State', () => {
    it('should return true for active route', () => {
      spyOnProperty(router, 'url').and.returnValue('/dashboard/projects');

      const result = component.isActiveRoute('/dashboard/projects');

      expect(result).toBe(true);
    });

    it('should return false for inactive route', () => {
      spyOnProperty(router, 'url').and.returnValue('/dashboard/tasks');

      const result = component.isActiveRoute('/dashboard/projects');

      expect(result).toBe(false);
    });

    it('should handle different route patterns', () => {
      spyOnProperty(router, 'url').and.returnValue('/dashboard/projects/123');

      const result = component.isActiveRoute('/dashboard/projects');

      expect(result).toBe(true);
    });
  });

  describe('User Management', () => {
    it('should set current user', () => {
      component.currentUser = mockUser;

      expect(component.currentUser).toEqual(mockUser);
      expect(component.currentUser?.username).toBe('testuser');
      expect(component.currentUser?.email).toBe('test@example.com');
    });

    it('should handle user properties', () => {
      component.currentUser = mockUser;

      expect(component.currentUser?.id).toBe(1);
      expect(component.currentUser?.username).toBe('testuser');
      expect(component.currentUser?.email).toBe('test@example.com');
    });
  });

  describe('Notification Management', () => {
    it('should update unread count', () => {
      component.unreadCount = 5;

      expect(component.unreadCount).toBe(5);
    });

    it('should handle zero unread count', () => {
      component.unreadCount = 0;

      expect(component.unreadCount).toBe(0);
    });

    it('should handle large unread count', () => {
      component.unreadCount = 999;

      expect(component.unreadCount).toBe(999);
    });
  });

  describe('Component Properties', () => {
    it('should have drawer property', () => {
      expect(component.drawer).toBeDefined();
    });

    it('should have currentUser property', () => {
      expect(component.currentUser).toBeDefined();
    });

    it('should have unreadCount property', () => {
      expect(component.unreadCount).toBeDefined();
      expect(typeof component.unreadCount).toBe('number');
    });
  });

  describe('Component Methods', () => {
    it('should have ngOnInit method', () => {
      expect(typeof component.ngOnInit).toBe('function');
    });

    it('should have logout method', () => {
      expect(typeof component.logout).toBe('function');
    });

    it('should have toggleSidenav method', () => {
      expect(typeof component.toggleSidenav).toBe('function');
    });

    it('should have closeSidenav method', () => {
      expect(typeof component.closeSidenav).toBe('function');
    });

    it('should have navigateToProjects method', () => {
      expect(typeof component.navigateToProjects).toBe('function');
    });

    it('should have navigateToTasks method', () => {
      expect(typeof component.navigateToTasks).toBe('function');
    });

    it('should have navigateToNotifications method', () => {
      expect(typeof component.navigateToNotifications).toBe('function');
    });

    it('should have isActiveRoute method', () => {
      expect(typeof component.isActiveRoute).toBe('function');
    });
  });
}); 