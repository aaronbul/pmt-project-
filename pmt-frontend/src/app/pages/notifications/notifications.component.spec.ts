import { NotificationsComponent } from './notifications.component';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { Notification } from '../../models/notification.model';
import { User } from '../../models/user.model';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let authService: jasmine.SpyObj<AuthService>;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com'
  };

  const mockNotifications: Notification[] = [
    {
      id: 1,
      title: 'Notification Test 1',
      message: 'Message de test 1',
      type: 'info',
      isRead: false,
      createdAt: '2024-01-01T00:00:00Z',
      userId: 1
    },
    {
      id: 2,
      title: 'Notification Test 2',
      message: 'Message de test 2',
      type: 'warning',
      isRead: true,
      createdAt: '2024-01-02T00:00:00Z',
      userId: 1
    }
  ];

  beforeEach(() => {
    notificationService = jasmine.createSpyObj('NotificationService', [
      'getNotificationsByUser',
      'markAsRead',
      'markAllAsRead'
    ]);
    authService = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

    component = new NotificationsComponent(
      notificationService,
      authService
    );
  });

  describe('Initialization', () => {
    it('should create component', () => {
      expect(component).toBeDefined();
    });

    it('should initialize with default values', () => {
      expect(component.notifications).toEqual([]);
      expect(component.loading).toBe(false);
      expect(component.currentUser).toBeNull();
    });
  });

  describe('ngOnInit', () => {
    it('should load notifications on init', () => {
      authService.getCurrentUser.and.returnValue(mockUser);
      notificationService.getNotificationsByUser.and.returnValue(of(mockNotifications));

      component.ngOnInit();

      expect(authService.getCurrentUser).toHaveBeenCalled();
      expect(notificationService.getNotificationsByUser).toHaveBeenCalledWith(1);
      expect(component.currentUser).toEqual(mockUser);
      expect(component.notifications).toEqual(mockNotifications);
      expect(component.loading).toBe(false);
    });

    it('should handle null current user', () => {
      authService.getCurrentUser.and.returnValue(null);

      component.ngOnInit();

      expect(component.currentUser).toBeNull();
      expect(notificationService.getNotificationsByUser).not.toHaveBeenCalled();
    });

    it('should handle empty notifications list', () => {
      authService.getCurrentUser.and.returnValue(mockUser);
      notificationService.getNotificationsByUser.and.returnValue(of([]));

      component.ngOnInit();

      expect(component.notifications).toEqual([]);
      expect(component.loading).toBe(false);
    });
  });

  describe('loadNotifications', () => {
    it('should load notifications successfully', () => {
      component.currentUser = mockUser;
      notificationService.getNotificationsByUser.and.returnValue(of(mockNotifications));

      component.loadNotifications();

      expect(component.loading).toBe(false);
      expect(component.notifications).toEqual(mockNotifications);
      expect(notificationService.getNotificationsByUser).toHaveBeenCalledWith(1);
    });

    it('should handle loading error', () => {
      component.currentUser = mockUser;
      notificationService.getNotificationsByUser.and.returnValue(throwError(() => new Error('Load failed')));

      component.loadNotifications();

      expect(component.loading).toBe(false);
      expect(component.notifications).toEqual([]);
    });

    it('should not load notifications without user id', () => {
      component.currentUser = { username: 'test', email: 'test@example.com' }; // No id

      component.loadNotifications();

      expect(notificationService.getNotificationsByUser).not.toHaveBeenCalled();
    });

    it('should not load notifications without current user', () => {
      component.currentUser = null;

      component.loadNotifications();

      expect(notificationService.getNotificationsByUser).not.toHaveBeenCalled();
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read successfully', () => {
      component.currentUser = mockUser;
      notificationService.markAsRead.and.returnValue(of(mockNotifications[0]));
      notificationService.getNotificationsByUser.and.returnValue(of(mockNotifications));

      component.markAsRead(1);

      expect(notificationService.markAsRead).toHaveBeenCalledWith(1);
      expect(notificationService.getNotificationsByUser).toHaveBeenCalledWith(1);
    });

    it('should handle mark as read error', () => {
      component.currentUser = mockUser;
      notificationService.markAsRead.and.returnValue(throwError(() => new Error('Mark failed')));

      component.markAsRead(1);

      expect(notificationService.markAsRead).toHaveBeenCalledWith(1);
      expect(notificationService.getNotificationsByUser).not.toHaveBeenCalled();
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read successfully', () => {
      component.currentUser = mockUser;
      notificationService.markAllAsRead.and.returnValue(of(void 0));
      notificationService.getNotificationsByUser.and.returnValue(of(mockNotifications));

      component.markAllAsRead();

      expect(notificationService.markAllAsRead).toHaveBeenCalledWith(1);
      expect(notificationService.getNotificationsByUser).toHaveBeenCalledWith(1);
    });

    it('should handle mark all as read error', () => {
      component.currentUser = mockUser;
      notificationService.markAllAsRead.and.returnValue(throwError(() => new Error('Mark all failed')));

      component.markAllAsRead();

      expect(notificationService.markAllAsRead).toHaveBeenCalledWith(1);
      expect(notificationService.getNotificationsByUser).not.toHaveBeenCalled();
    });

    it('should not mark all as read without user id', () => {
      component.currentUser = { username: 'test', email: 'test@example.com' }; // No id

      component.markAllAsRead();

      expect(notificationService.markAllAsRead).not.toHaveBeenCalled();
    });

    it('should not mark all as read without current user', () => {
      component.currentUser = null;

      component.markAllAsRead();

      expect(notificationService.markAllAsRead).not.toHaveBeenCalled();
    });
  });

  describe('Notification Management', () => {
    it('should handle notifications with all properties', () => {
      const notification: Notification = {
        id: 1,
        title: 'Test Notification',
        message: 'Test Message',
        type: 'info',
        isRead: false,
        createdAt: '2024-01-01T00:00:00Z',
        userId: 1
      };

      component.notifications = [notification];

      expect(component.notifications[0].id).toBe(1);
      expect(component.notifications[0].title).toBe('Test Notification');
      expect(component.notifications[0].message).toBe('Test Message');
      expect(component.notifications[0].isRead).toBe(false);
    });

    it('should handle notifications with minimal properties', () => {
      const notification: Notification = {
        title: 'Minimal Notification',
        message: 'Minimal Message',
        type: 'info',
        isRead: false,
        userId: 1
      };

      component.notifications = [notification];

      expect(component.notifications[0].title).toBe('Minimal Notification');
      expect(component.notifications[0].id).toBeUndefined();
      expect(component.notifications[0].createdAt).toBeUndefined();
    });

    it('should handle multiple notifications', () => {
      component.notifications = mockNotifications;

      expect(component.notifications.length).toBe(2);
      expect(component.notifications[0].title).toBe('Notification Test 1');
      expect(component.notifications[1].title).toBe('Notification Test 2');
    });

    it('should handle read and unread notifications', () => {
      component.notifications = mockNotifications;

      expect(component.notifications[0].isRead).toBe(false);
      expect(component.notifications[1].isRead).toBe(true);
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

    it('should handle loading during notification fetch', () => {
      component.currentUser = mockUser;
      notificationService.getNotificationsByUser.and.returnValue(of(mockNotifications));

      component.loadNotifications();

      expect(component.loading).toBe(false); // Should be false after completion
    });
  });

  describe('Component Properties', () => {
    it('should have notifications property', () => {
      expect(component.notifications).toBeDefined();
      expect(Array.isArray(component.notifications)).toBe(true);
    });

    it('should have loading property', () => {
      expect(component.loading).toBeDefined();
      expect(typeof component.loading).toBe('boolean');
    });

    it('should have currentUser property', () => {
      expect(component.currentUser).toBeDefined();
    });
  });

  describe('Component Methods', () => {
    it('should have ngOnInit method', () => {
      expect(typeof component.ngOnInit).toBe('function');
    });

    it('should have loadNotifications method', () => {
      expect(typeof component.loadNotifications).toBe('function');
    });

    it('should have markAsRead method', () => {
      expect(typeof component.markAsRead).toBe('function');
    });

    it('should have markAllAsRead method', () => {
      expect(typeof component.markAllAsRead).toBe('function');
    });
  });
}); 