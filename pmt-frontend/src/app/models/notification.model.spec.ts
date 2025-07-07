import { Notification } from './notification.model';

describe('Notification Model', () => {
  describe('Notification Interface', () => {
    it('should create a valid notification object', () => {
      const notification: Notification = {
        id: 1,
        userId: 1,
        title: 'Test Notification',
        message: 'This is a test notification message',
        type: 'INFO',
        isRead: false,
        relatedEntityType: 'TASK',
        relatedEntityId: 123,
        createdAt: '2024-01-01T00:00:00Z'
      };

      expect(notification.id).toBe(1);
      expect(notification.userId).toBe(1);
      expect(notification.title).toBe('Test Notification');
      expect(notification.message).toBe('This is a test notification message');
      expect(notification.type).toBe('INFO');
      expect(notification.isRead).toBe(false);
      expect(notification.relatedEntityType).toBe('TASK');
      expect(notification.relatedEntityId).toBe(123);
      expect(notification.createdAt).toBe('2024-01-01T00:00:00Z');
    });

    it('should create a notification with minimal required properties', () => {
      const notification: Notification = {
        userId: 1,
        title: 'Minimal Notification',
        message: 'Minimal message',
        type: 'WARNING',
        isRead: true
      };

      expect(notification.userId).toBe(1);
      expect(notification.title).toBe('Minimal Notification');
      expect(notification.message).toBe('Minimal message');
      expect(notification.type).toBe('WARNING');
      expect(notification.isRead).toBe(true);
      expect(notification.id).toBeUndefined();
      expect(notification.relatedEntityType).toBeUndefined();
      expect(notification.relatedEntityId).toBeUndefined();
      expect(notification.createdAt).toBeUndefined();
    });

    it('should handle different notification types', () => {
      const types = ['INFO', 'WARNING', 'ERROR', 'SUCCESS'];

      types.forEach(type => {
        const notification: Notification = {
          userId: 1,
          title: `${type} Notification`,
          message: `This is a ${type.toLowerCase()} notification`,
          type,
          isRead: false
        };

        expect(notification.type).toBe(type);
        expect(notification.title).toBe(`${type} Notification`);
      });
    });

    it('should handle read and unread notifications', () => {
      const readNotification: Notification = {
        userId: 1,
        title: 'Read Notification',
        message: 'This notification has been read',
        type: 'INFO',
        isRead: true
      };

      const unreadNotification: Notification = {
        userId: 1,
        title: 'Unread Notification',
        message: 'This notification has not been read',
        type: 'WARNING',
        isRead: false
      };

      expect(readNotification.isRead).toBe(true);
      expect(unreadNotification.isRead).toBe(false);
    });

    it('should handle notifications with related entities', () => {
      const taskNotification: Notification = {
        userId: 1,
        title: 'Task Updated',
        message: 'Task "Fix Bug" has been updated',
        type: 'INFO',
        isRead: false,
        relatedEntityType: 'TASK',
        relatedEntityId: 456
      };

      const projectNotification: Notification = {
        userId: 1,
        title: 'Project Created',
        message: 'New project "PMT Tool" has been created',
        type: 'SUCCESS',
        isRead: false,
        relatedEntityType: 'PROJECT',
        relatedEntityId: 789
      };

      expect(taskNotification.relatedEntityType).toBe('TASK');
      expect(taskNotification.relatedEntityId).toBe(456);
      expect(projectNotification.relatedEntityType).toBe('PROJECT');
      expect(projectNotification.relatedEntityId).toBe(789);
    });

    it('should handle notifications without related entities', () => {
      const notification: Notification = {
        userId: 1,
        title: 'General Notification',
        message: 'This is a general notification without related entity',
        type: 'INFO',
        isRead: false
      };

      expect(notification.relatedEntityType).toBeUndefined();
      expect(notification.relatedEntityId).toBeUndefined();
    });

    it('should handle different message lengths', () => {
      const shortMessage = 'Short';
      const mediumMessage = 'This is a medium length notification message';
      const longMessage = 'This is a very long notification message that contains a lot of text and should be handled properly by the system';

      const notifications: Notification[] = [
        {
          userId: 1,
          title: 'Short Message',
          message: shortMessage,
          type: 'INFO',
          isRead: false
        },
        {
          userId: 1,
          title: 'Medium Message',
          message: mediumMessage,
          type: 'WARNING',
          isRead: false
        },
        {
          userId: 1,
          title: 'Long Message',
          message: longMessage,
          type: 'ERROR',
          isRead: false
        }
      ];

      expect(notifications[0].message).toBe(shortMessage);
      expect(notifications[1].message).toBe(mediumMessage);
      expect(notifications[2].message).toBe(longMessage);
    });

    it('should handle notifications for different users', () => {
      const userIds = [1, 2, 3, 100];

      userIds.forEach(userId => {
        const notification: Notification = {
          userId,
          title: `Notification for user ${userId}`,
          message: `This notification belongs to user ${userId}`,
          type: 'INFO',
          isRead: false
        };

        expect(notification.userId).toBe(userId);
        expect(notification.title).toBe(`Notification for user ${userId}`);
      });
    });
  });
}); 