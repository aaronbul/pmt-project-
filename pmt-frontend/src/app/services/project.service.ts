import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, ProjectMember } from '../models/project.model';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects`);
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/projects/${id}`).pipe(
      tap(() => console.log('Fetch a fini de se charger : GET "' + this.apiUrl + '/projects/' + id + '".'))
    );
  }

  createProject(project: Partial<Project>): Observable<Project> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) {
      throw new Error('Utilisateur non connecté');
    }
    
    return this.http.post<Project>(`${this.apiUrl}/projects?createdById=${currentUser.id}`, project).pipe(
      tap(() => console.log('Projet créé avec succès'))
    );
  }

  updateProject(id: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/projects/${id}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/projects/${id}`);
  }

  getProjectMembers(projectId: number): Observable<ProjectMember[]> {
    return this.http.get<ProjectMember[]>(`${this.apiUrl}/project-members/project/${projectId}`);
  }

  addProjectMember(projectMember: ProjectMember): Observable<ProjectMember> {
    return this.http.post<ProjectMember>(`${this.apiUrl}/project-members`, projectMember);
  }

  updateProjectMember(id: number, projectMember: ProjectMember): Observable<ProjectMember> {
    return this.http.put<ProjectMember>(`${this.apiUrl}/project-members/${id}`, projectMember);
  }

  deleteProjectMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/project-members/${id}`);
  }

  updateMemberRole(memberId: number, roleId: number): Observable<ProjectMember> {
    return this.http.put<ProjectMember>(`${this.apiUrl}/project-members/${memberId}/role/${roleId}`, {});
  }

  checkProjectMembership(projectId: number, userId: number): Observable<ProjectMember | null> {
    return this.http.get<ProjectMember>(`${this.apiUrl}/project-members/check/${projectId}/${userId}`);
  }

  getMembersByRole(roleId: number): Observable<ProjectMember[]> {
    return this.http.get<ProjectMember[]>(`${this.apiUrl}/project-members/role/${roleId}`);
  }
} 