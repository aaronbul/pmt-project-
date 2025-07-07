import { RoleService } from './role.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Role } from '../models/project.model';

describe('RoleService', () => {
  let service: RoleService;
  let httpClient: jasmine.SpyObj<HttpClient>;

  const mockRole: Role = {
    id: 1,
    name: 'ADMIN'
  };

  beforeEach(() => {
    httpClient = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    service = new RoleService(httpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Role Operations', () => {
    it('should get all roles', () => {
      const roles = [mockRole];
      httpClient.get.and.returnValue(of(roles));

      service.getAllRoles().subscribe((result: Role[]) => {
        expect(result).toEqual(roles);
      });

      expect(httpClient.get).toHaveBeenCalledWith('http://localhost:8080/api/roles');
    });

    it('should get role by id', () => {
      httpClient.get.and.returnValue(of(mockRole));

      service.getRoleById(1).subscribe((result: Role) => {
        expect(result).toEqual(mockRole);
      });

      expect(httpClient.get).toHaveBeenCalledWith('http://localhost:8080/api/roles/1');
    });
  });

  describe('API URL Configuration', () => {
    it('should have correct API URL', () => {
      expect(service['apiUrl']).toBe('http://localhost:8080/api');
    });
  });
}); 