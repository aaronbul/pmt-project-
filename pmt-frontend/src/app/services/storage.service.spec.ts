import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    // Mock PLATFORM_ID for browser environment
    const mockPlatformId = 'browser';
    service = new StorageService(mockPlatformId);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get item', () => {
    const key = 'testKey';
    const value = 'testValue';
    
    service.setItem(key, value);
    const result = service.getItem(key);
    
    expect(result).toBe(value);
  });

  it('should return null for non-existent key', () => {
    const result = service.getItem('nonExistentKey');
    expect(result).toBeNull();
  });

  it('should remove item', () => {
    const key = 'testKey';
    const value = 'testValue';
    
    service.setItem(key, value);
    service.removeItem(key);
    const result = service.getItem(key);
    
    expect(result).toBeNull();
  });

  it('should clear all items', () => {
    service.setItem('key1', 'value1');
    service.setItem('key2', 'value2');
    
    service.clear();
    
    expect(service.getItem('key1')).toBeNull();
    expect(service.getItem('key2')).toBeNull();
  });
}); 