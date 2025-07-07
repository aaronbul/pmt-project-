import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      { path: '', redirectTo: 'projects', pathMatch: 'full' },
      { path: 'projects', loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent) },
      { path: 'projects/create', loadComponent: () => import('./pages/create-project/create-project.component').then(m => m.CreateProjectComponent) },
      { path: 'projects/:id', loadComponent: () => import('./pages/project-detail/project-detail.component').then(m => m.ProjectDetailComponent) },
      { path: 'projects/:id/edit', loadComponent: () => import('./pages/edit-project/edit-project.component').then(m => m.EditProjectComponent) },
      { path: 'projects/:id/members', loadComponent: () => import('./pages/project-members/project-members').then(m => m.ProjectMembersComponent) },
      { path: 'tasks', loadComponent: () => import('./pages/tasks/tasks.component').then(m => m.TasksComponent) },
      { path: 'tasks/create', loadComponent: () => import('./pages/create-task/create-task.component').then(m => m.CreateTaskComponent) },
      { path: 'tasks/:id/view', loadComponent: () => import('./pages/view-task/view-task.component').then(m => m.ViewTaskComponent) },
      { path: 'tasks/:id/edit', loadComponent: () => import('./pages/edit-task/edit-task.component').then(m => m.EditTaskComponent) },
      { path: 'notifications', loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent) }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
