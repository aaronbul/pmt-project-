import { NotificationService } from './notification.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Notification } from '../models/notification.model';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpClient: jasmine.SpyObj<HttpClient>;

  const mockNotification: Notification = {
    id: 1,
    type: 'INFO',
    title: 'Test notification',
    message: 'Test notification message',
    userId: 1,
    isRead: false,
    createdAt: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    httpClient = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    service = new NotificationService(httpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Notification CRUD Operations', () => {
    it('should get all notifications', () => {
      const notifications = [mockNotification];
      httpClient.get.and.returnValue(of(notifications));

      service.getAllNotifications().subscribe(result => {
        expect(result).toEqual(notifications);
      });

      expect(httpClient.get).toHaveBeenCalledWith('http://localhost:8080/api/notifications');
    });

    it('should get notification by id', () => {
      httpClient.get.and.returnValue(of(mockNotification));

      service.getNotificationById(1).subscribe(result => {
        expect(result).toEqual(mockNotification);
      });

      expect(httpClient.get).toHaveBeenCalledWith('http://localhost:8080/api/notifications/1');
    });

    it('should create notification', () => {
      httpClient.post.and.returnValue(of(mockNotification));

      const newNotification = { 
        type: 'INFO', 
        title: 'New notification',
        message: 'New notification message',
        userId: 1,
        isRead: false
      };

      service.createNotification(newNotification).subscribe(result => {
        expect(result).toEqual(mockNotification);
      });

      expect(httpClient.post).toHaveBeenCalledWith(
        'http://localhost:8080/api/notifications',
        newNotification
      );
    });

    it('should update notification', () => {
      httpClient.put.and.returnValue(of(mockNotification));

      service.updateNotification(1, mockNotification).subscribe(result => {
        expect(result).toEqual(mockNotification);
      });

      expect(httpClient.put).toHaveBeenCalledWith(
        'http://localhost:8080/api/notifications/1',
        mockNotification
      );
    });

    it('should delete notification', () => {
      httpClient.delete.and.returnValue(of(void 0));

      service.deleteNotification(1).subscribe();

      expect(httpClient.delete).toHaveBeenCalledWith('http://localhost:8080/api/notifications/1');
    });
  });

  describe('Notification Filtering Operations', () => {
    it('should get notifications by user', () => {
      const notifications = [mockNotification];
      httpClient.get.and.returnValue(of(notifications));

      service.getNotificationsByUser(1).subscribe(result => {
        expect(result).toEqual(notifications);
      });

      expect(httpClient.get).toHaveBeenCalledWith('http://localhost:8080/api/notifications/user/1');
    });

    it('should get unread notifications', () => {
      const notifications = [mockNotification];
      httpClient.get.and.returnValue(of(notifications));

      service.getUnreadNotifications(1).subscribe(result => {
        expect(result).toEqual(notifications);
      });

      expect(httpClient.get).toHaveBeenCalledWith('http://localhost:8080/api/notifications/user/1/unread');
    });

    it('should mark notification as read', () => {
      httpClient.put.and.returnValue(of(mockNotification));

      service.markAsRead(1).subscribe(result => {
        expect(result).toEqual(mockNotification);
      });

      expect(httpClient.put).toHaveBeenCalledWith('http://localhost:8080/api/notifications/1/read', {});
    });

    it('should mark all notifications as read', () => {
      httpClient.put.and.returnValue(of(void 0));

      service.markAllAsRead(1).subscribe();

      expect(httpClient.put).toHaveBeenCalledWith('http://localhost:8080/api/notifications/user/1/read-all', {});
    });
  });

  describe('API URL Configuration', () => {
    it('should have correct API URL', () => {
      expect(service['apiUrl']).toBe('http://localhost:8080/api');
    });
  });
}); 