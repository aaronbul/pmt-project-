import { ProjectService } from './project.service';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(() => {
    service = new ProjectService(null as any, null as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have getAllProjects method', () => {
    expect(service.getAllProjects).toBeDefined();
  });

  it('should have getProjectById method', () => {
    expect(service.getProjectById).toBeDefined();
  });

  it('should have createProject method', () => {
    expect(service.createProject).toBeDefined();
  });

  it('should have updateProject method', () => {
    expect(service.updateProject).toBeDefined();
  });

  it('should have deleteProject method', () => {
    expect(service.deleteProject).toBeDefined();
  });

  it('should have getProjectMembers method', () => {
    expect(service.getProjectMembers).toBeDefined();
  });

  it('should have correct API URL', () => {
    expect(service['apiUrl']).toBe('http://localhost:8080/api');
  });
}); 