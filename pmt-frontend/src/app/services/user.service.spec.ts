import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { User } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpClient: jasmine.SpyObj<HttpClient>;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com'
  };

  beforeEach(() => {
    httpClient = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    service = new UserService(httpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('User Operations', () => {
    it('should get all users', () => {
      const users = [mockUser];
      httpClient.get.and.returnValue(of(users));

      service.getAllUsers().subscribe((result: User[]) => {
        expect(result).toEqual(users);
      });

      expect(httpClient.get).toHaveBeenCalledWith('http://localhost:8080/api/users');
    });

    it('should get user by id', () => {
      httpClient.get.and.returnValue(of(mockUser));

      service.getUserById(1).subscribe((result: User) => {
        expect(result).toEqual(mockUser);
      });

      expect(httpClient.get).toHaveBeenCalledWith('http://localhost:8080/api/users/1');
    });

    it('should get current user', () => {
      httpClient.get.and.returnValue(of(mockUser));

      service.getCurrentUser().subscribe((result: User) => {
        expect(result).toEqual(mockUser);
      });

      expect(httpClient.get).toHaveBeenCalledWith('http://localhost:8080/api/users/me');
    });
  });

  describe('API URL Configuration', () => {
    it('should have correct API URL', () => {
      expect(service['apiUrl']).toBe('http://localhost:8080/api');
    });
  });
}); 