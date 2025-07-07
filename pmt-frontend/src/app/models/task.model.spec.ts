import { Task, TaskStatus, TaskHistory } from './task.model';

describe('Task Model', () => {
  describe('Task Interface', () => {
    it('should create a valid task object', () => {
      const task: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        statusId: 1,
        priority: 'MEDIUM',
        projectId: 1,
        assignedTo: 2,
        createdBy: 1,
        dueDate: '2024-12-31',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      expect(task.id).toBe(1);
      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('Test Description');
      expect(task.statusId).toBe(1);
      expect(task.priority).toBe('MEDIUM');
      expect(task.projectId).toBe(1);
      expect(task.assignedTo).toBe(2);
      expect(task.createdBy).toBe(1);
    });

    it('should create a task with optional properties', () => {
      const task: Task = {
        title: 'Minimal Task',
        statusId: 1,
        priority: 'HIGH',
        projectId: 1,
        createdBy: 1
      };

      expect(task.title).toBe('Minimal Task');
      expect(task.statusId).toBe(1);
      expect(task.priority).toBe('HIGH');
      expect(task.projectId).toBe(1);
      expect(task.createdBy).toBe(1);
      expect(task.id).toBeUndefined();
      expect(task.description).toBeUndefined();
    });

    it('should accept all priority values', () => {
      const priorities: Array<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'> = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
      
      priorities.forEach(priority => {
        const task: Task = {
          title: `Task with ${priority} priority`,
          statusId: 1,
          priority,
          projectId: 1,
          createdBy: 1
        };
        
        expect(task.priority).toBe(priority);
      });
    });

    it('should handle task with related entities', () => {
      const task: Task = {
        id: 1,
        title: 'Task with Relations',
        statusId: 1,
        priority: 'MEDIUM',
        projectId: 1,
        createdBy: 1,
        statusName: 'In Progress',
        projectName: 'Test Project',
        assignedToName: 'John Doe',
        createdByName: 'Jane Smith'
      };

      expect(task.statusName).toBe('In Progress');
      expect(task.projectName).toBe('Test Project');
      expect(task.assignedToName).toBe('John Doe');
      expect(task.createdByName).toBe('Jane Smith');
    });
  });

  describe('TaskStatus Interface', () => {
    it('should create a valid task status object', () => {
      const status: TaskStatus = {
        id: 1,
        name: 'In Progress'
      };

      expect(status.id).toBe(1);
      expect(status.name).toBe('In Progress');
    });

    it('should create a task status with optional id', () => {
      const status: TaskStatus = {
        name: 'To Do'
      };

      expect(status.name).toBe('To Do');
      expect(status.id).toBeUndefined();
    });
  });

  describe('TaskHistory Interface', () => {
    it('should create a valid task history object', () => {
      const history: TaskHistory = {
        id: 1,
        taskId: 1,
        userId: 1,
        action: 'STATUS_CHANGED',
        oldValue: 'To Do',
        newValue: 'In Progress',
        createdAt: '2024-01-01T00:00:00Z'
      };

      expect(history.id).toBe(1);
      expect(history.taskId).toBe(1);
      expect(history.userId).toBe(1);
      expect(history.action).toBe('STATUS_CHANGED');
      expect(history.oldValue).toBe('To Do');
      expect(history.newValue).toBe('In Progress');
      expect(history.createdAt).toBe('2024-01-01T00:00:00Z');
    });

    it('should create a task history with optional values', () => {
      const history: TaskHistory = {
        taskId: 1,
        userId: 1,
        action: 'CREATED'
      };

      expect(history.taskId).toBe(1);
      expect(history.userId).toBe(1);
      expect(history.action).toBe('CREATED');
      expect(history.id).toBeUndefined();
      expect(history.oldValue).toBeUndefined();
      expect(history.newValue).toBeUndefined();
      expect(history.createdAt).toBeUndefined();
    });
  });
}); 