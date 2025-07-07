import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskHistory } from '../models/task.model';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`);
  }

  getTaskById(id: number): Observable<Task> {
    console.log('TaskService - getTaskById appelé avec id:', id);
    console.log('TaskService - URL appelée:', `${this.apiUrl}/tasks/${id}`);
    return this.http.get<Task>(`${this.apiUrl}/tasks/${id}`).pipe(
      tap({
        next: (task) => console.log('TaskService - Tâche récupérée:', task),
        error: (error) => console.error('TaskService - Erreur HTTP:', error)
      })
    );
  }

  getTasksByProject(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks/project/${projectId}`);
  }

  getTasksByStatus(statusId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks/status/${statusId}`);
  }

  getTasksByAssignee(userId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks/assignee/${userId}`);
  }

  getCurrentUserTasks(): Observable<Task[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) {
      throw new Error('Utilisateur non connecté');
    }
    return this.getTasksByAssignee(currentUser.id);
  }

  createTask(task: Partial<Task>): Observable<Task> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) {
      throw new Error('Utilisateur non connecté');
    }
    
    // Convertir en format attendu par le backend
    const taskCreateData = {
      title: task.title,
      description: task.description,
      priority: task.priority || 'MEDIUM',
      projectId: task.projectId,
      assignedToId: task.assignedTo || undefined,
      createdById: currentUser.id,
      dueDate: task.dueDate ? this.formatDateForBackend(task.dueDate) : undefined
    };
    
    return this.http.post<Task>(`${this.apiUrl}/tasks`, taskCreateData).pipe(
      tap(() => console.log('Tâche créée avec succès'))
    );
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    // Convertir en format attendu par le backend (TaskUpdateDTO)
    const taskUpdateData = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status?.name, // Le backend convertira cette chaîne en TaskStatusEnum
      assignedToId: task.assignedTo,
      dueDate: task.dueDate ? this.formatDateForBackend(task.dueDate) : undefined
    };
    
    console.log('Données de mise à jour envoyées:', JSON.stringify(taskUpdateData, null, 2));
    
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}`, taskUpdateData).pipe(
      tap({
        error: (error) => {
          console.error('Erreur détaillée:', error);
          if (error.error) {
            console.error('Corps de l\'erreur:', error.error);
          }
        }
      })
    );
  }

  private formatDateForBackend(dateString: string): string {
    const date = new Date(dateString);
    // Utiliser le fuseau horaire local pour éviter le décalage
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`);
  }

  getTaskHistory(taskId: number): Observable<TaskHistory[]> {
    return this.http.get<TaskHistory[]>(`${this.apiUrl}/task-history/task/${taskId}`);
  }
} 