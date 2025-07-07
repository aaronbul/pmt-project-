import { User } from './user.model';

export interface Notification {
  id?: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  relatedEntityType?: string;
  relatedEntityId?: number;
  createdAt?: string;
  user?: User;
} 