import { TaskService } from './task.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Task } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpClient: jasmine.SpyObj<HttpClient>;

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    statusId: 1,
    priority: 'MEDIUM',
    projectId: 1,
    assignedToId: 1,
    createdBy: 1,
    dueDate: '2024-12-31',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    httpClient = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    const authService = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    authService.getCurrentUser.and.returnValue({ id: 1, username: 'test', email: 'test@test.com' });
    service = new TaskService(httpClient, authService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Task CRUD Operations', () => {
    it('should get all tasks', () => {
      const tasks = [mockTask];
      httpClient.get.and.returnValue(of(tasks));

      service.getAllTasks().subscribe(result => {
        expect(result).toEqual(tasks);
      });

      expect(httpClient.get).toHaveBeenCalledWith('http://localhost:8080/api/tasks');
    });

    it('should get task by id', () => {
      httpClient.get.and.returnValue(of(mockTask));

      service.getTaskById(1).subscribe(result => {
        expect(result).toEqual(mockTask);
      });

      expect(httpClient.get).toHaveBeenCalledWith('http://localhost:8080/api/tasks/1');
    });

    it('should create task', () => {
      httpClient.post.and.returnValue(of(mockTask));

      const newTask = { title: 'New Task', description: 'New Description' };

      service.createTask(newTask).subscribe(result => {
        expect(result).toEqual(mockTask);
      });

      // Le service transforme les données avant l'envoi
      expect(httpClient.post).toHaveBeenCalledWith(
        'http://localhost:8080/api/tasks',
        jasmine.objectContaining({
          title: 'New Task',
          description: 'New Description',
          priority: 'MEDIUM',
          createdById: 1
        })
      );
    });

    it('should update task', () => {
      httpClient.put.and.returnValue(of(mockTask));

      service.updateTask(1, mockTask).subscribe(result => {
        expect(result).toEqual(mockTask);
      });

      // Le service transforme les données avant l'envoi
      expect(httpClient.put).toHaveBeenCalledWith(
        'http://localhost:8080/api/tasks/1',
        jasmine.objectContaining({
          title: 'Test Task',
          description: 'Test Description',
          priority: 'MEDIUM',
          dueDate: '2024-12-31'
        })
      );
    });

    it('should delete task', () => {
      httpClient.delete.and.returnValue(of(void 0));

      service.deleteTask(1).subscribe();

      expect(httpClient.delete).toHaveBeenCalledWith('http://localhost:8080/api/tasks/1');
    });
  });

  describe('Task Filtering Operations', () => {
    it('should get tasks by project', () => {
      const tasks = [mockTask];
      httpClient.get.and.returnValue(of(tasks));

      service.getTasksByProject(1).subscribe(result => {
        expect(result).toEqual(tasks);
      });

      expect(httpClient.get).toHaveBeenCalledWith('http://localhost:8080/api/tasks/project/1');
    });

    it('should get tasks by status', () => {
      const tasks = [mockTask];
      httpClient.get.and.returnValue(of(tasks));

      service.getTasksByStatus(1).subscribe((result: Task[]) => {
        expect(result).toEqual(tasks);
      });

      expect(httpClient.get).toHaveBeenCalledWith('http://localhost:8080/api/tasks/status/1');
    });

    it('should get tasks by assignee', () => {
      const tasks = [mockTask];
      httpClient.get.and.returnValue(of(tasks));

      service.getTasksByAssignee(1).subscribe(result => {
        expect(result).toEqual(tasks);
      });

      expect(httpClient.get).toHaveBeenCalledWith('http://localhost:8080/api/tasks/assignee/1');
    });
  });

  describe('Task History Operations', () => {
    it('should get task history', () => {
      const history = [{ id: 1, taskId: 1, userId: 1, action: 'CREATED' }];
      httpClient.get.and.returnValue(of(history));

      service.getTaskHistory(1).subscribe(result => {
        expect(result).toEqual(history);
      });

      expect(httpClient.get).toHaveBeenCalledWith('http://localhost:8080/api/task-history/task/1');
    });
  });

  describe('API URL Configuration', () => {
    it('should have correct API URL', () => {
      expect(service['apiUrl']).toBe('http://localhost:8080/api');
    });
  });
}); 