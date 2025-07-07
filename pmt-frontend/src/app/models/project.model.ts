import { User } from './user.model';

export interface Project {
  id?: number;
  name: string;
  description?: string;
  startDate: string;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
  createdByUser?: User;
  memberCount?: number;
}

export interface ProjectMember {
  id?: number;
  projectId: number;
  userId: number;
  roleId: number;
  joinedAt?: string;
  user?: User;
  role?: Role;
}

export interface Role {
  id?: number;
  name: string;
} 