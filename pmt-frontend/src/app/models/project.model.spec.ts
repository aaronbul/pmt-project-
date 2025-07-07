import { Project, ProjectMember, Role } from './project.model';

describe('Project Model', () => {
  describe('Project Interface', () => {
    it('should create a valid project object', () => {
      const project: Project = {
        id: 1,
        name: 'Test Project',
        description: 'Test Description',
        startDate: '2024-01-01',
        createdBy: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        memberCount: 5
      };

      expect(project.id).toBe(1);
      expect(project.name).toBe('Test Project');
      expect(project.description).toBe('Test Description');
      expect(project.startDate).toBe('2024-01-01');
      expect(project.createdBy).toBe(1);
      expect(project.createdAt).toBe('2024-01-01T00:00:00Z');
      expect(project.updatedAt).toBe('2024-01-01T00:00:00Z');
      expect(project.memberCount).toBe(5);
    });

    it('should create a project with minimal required properties', () => {
      const project: Project = {
        name: 'Minimal Project',
        startDate: '2024-01-01'
      };

      expect(project.name).toBe('Minimal Project');
      expect(project.startDate).toBe('2024-01-01');
      expect(project.id).toBeUndefined();
      expect(project.description).toBeUndefined();
      expect(project.createdBy).toBeUndefined();
      expect(project.createdAt).toBeUndefined();
      expect(project.updatedAt).toBeUndefined();
      expect(project.memberCount).toBeUndefined();
    });

    it('should handle project with optional description', () => {
      const project: Project = {
        name: 'Project with Description',
        startDate: '2024-01-01',
        description: 'This is a detailed description'
      };

      expect(project.name).toBe('Project with Description');
      expect(project.startDate).toBe('2024-01-01');
      expect(project.description).toBe('This is a detailed description');
    });

    it('should handle project without description', () => {
      const project: Project = {
        name: 'Project without Description',
        startDate: '2024-01-01'
      };

      expect(project.name).toBe('Project without Description');
      expect(project.startDate).toBe('2024-01-01');
      expect(project.description).toBeUndefined();
    });
  });

  describe('ProjectMember Interface', () => {
    it('should create a valid project member object', () => {
      const member: ProjectMember = {
        id: 1,
        projectId: 1,
        userId: 2,
        roleId: 1,
        joinedAt: '2024-01-01T00:00:00Z'
      };

      expect(member.id).toBe(1);
      expect(member.projectId).toBe(1);
      expect(member.userId).toBe(2);
      expect(member.roleId).toBe(1);
      expect(member.joinedAt).toBe('2024-01-01T00:00:00Z');
    });

    it('should create a project member with minimal required properties', () => {
      const member: ProjectMember = {
        projectId: 1,
        userId: 2,
        roleId: 1
      };

      expect(member.projectId).toBe(1);
      expect(member.userId).toBe(2);
      expect(member.roleId).toBe(1);
      expect(member.id).toBeUndefined();
      expect(member.joinedAt).toBeUndefined();
    });

    it('should handle different role assignments', () => {
      const adminMember: ProjectMember = {
        projectId: 1,
        userId: 1,
        roleId: 1 // Admin role
      };

      const regularMember: ProjectMember = {
        projectId: 1,
        userId: 2,
        roleId: 2 // Member role
      };

      const observerMember: ProjectMember = {
        projectId: 1,
        userId: 3,
        roleId: 3 // Observer role
      };

      expect(adminMember.roleId).toBe(1);
      expect(regularMember.roleId).toBe(2);
      expect(observerMember.roleId).toBe(3);
    });
  });

  describe('Role Interface', () => {
    it('should create a valid role object', () => {
      const role: Role = {
        id: 1,
        name: 'Admin'
      };

      expect(role.id).toBe(1);
      expect(role.name).toBe('Admin');
    });

    it('should create a role with optional id', () => {
      const role: Role = {
        name: 'Member'
      };

      expect(role.name).toBe('Member');
      expect(role.id).toBeUndefined();
    });

    it('should handle different role types', () => {
      const roles: Role[] = [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'Member' },
        { id: 3, name: 'Observer' }
      ];

      expect(roles[0].name).toBe('Admin');
      expect(roles[1].name).toBe('Member');
      expect(roles[2].name).toBe('Observer');
    });
  });
}); 