import { User } from './user.model';
import { Project } from './project.model';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  statusId: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  projectId: number;
  assignedTo?: number;
  createdBy: number;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: TaskStatus;
  statusName?: string;
  project?: Project;
  projectName?: string;
  assignedToUser?: User;
  assignedToId?: number;
  assignedToName?: string;
  createdByUser?: User;
  createdById?: number;
  createdByName?: string;
}

export interface TaskStatus {
  id?: number;
  name: string;
}

export interface TaskHistory {
  id?: number;
  taskId: number;
  userId: number;
  action: string;
  oldValue?: string;
  newValue?: string;
  createdAt?: string;
  user?: User;
} 