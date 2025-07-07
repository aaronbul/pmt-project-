import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

describe('AuthService', () => {
  let service: AuthService;
  let storageService: StorageService;

  beforeEach(() => {
    storageService = new StorageService('browser');
    service = new AuthService(null as any, storageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null when no user is logged in', () => {
    const user = service.getCurrentUser();
    expect(user).toBeNull();
  });

  it('should return false when user is not logged in', () => {
    const isLoggedIn = service.isLoggedIn();
    expect(isLoggedIn).toBe(false);
  });

  it('should return true when user is logged in', () => {
    const mockUser = { id: 1, username: 'test', email: 'test@example.com' };
    storageService.setItem('currentUser', JSON.stringify(mockUser));
    
    // Recreate service to trigger constructor logic
    const newService = new AuthService(null as any, storageService);
    
    const isLoggedIn = newService.isLoggedIn();
    expect(isLoggedIn).toBe(true);
  });

  it('should clear user data on logout', () => {
    const mockUser = { id: 1, username: 'test', email: 'test@example.com' };
    storageService.setItem('currentUser', JSON.stringify(mockUser));
    
    service.logout();
    
    expect(service.getCurrentUser()).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
  });
}); 