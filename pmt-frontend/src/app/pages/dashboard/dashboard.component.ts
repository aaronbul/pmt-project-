import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { User } from '../../models/user.model';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatBadgeModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport
          [attr.role]="'navigation'"
          [mode]="'side'"
          [opened]="false"
          [fixedInViewport]="true">
        
        <mat-toolbar class="sidenav-toolbar">
          <span class="app-title">PMT</span>
        </mat-toolbar>
        
        <mat-nav-list>
          <button mat-list-item (click)="navigateToProjects()" [class.active]="isActiveRoute('/dashboard/projects')">
            <mat-icon matListItemIcon>folder</mat-icon>
            <span matListItemTitle>Projets</span>
          </button>
          
          <button mat-list-item (click)="navigateToTasks()" [class.active]="isActiveRoute('/dashboard/tasks')">
            <mat-icon matListItemIcon>assignment</mat-icon>
            <span matListItemTitle>Tâches</span>
          </button>
          
          <button mat-list-item (click)="navigateToNotifications()" [class.active]="isActiveRoute('/dashboard/notifications')">
            <mat-icon matListItemIcon>notifications</mat-icon>
            <span matListItemTitle>Notifications</span>
            <mat-icon matListItemMeta 
                      *ngIf="unreadCount > 0" 
                      [matBadge]="unreadCount" 
                      matBadgeColor="warn"
                      class="notification-badge">
              notifications
            </mat-icon>
          </button>
        </mat-nav-list>
      </mat-sidenav>
      
      <mat-sidenav-content class="sidenav-content">
        <mat-toolbar color="primary" class="main-toolbar">
          <button
            type="button"
            aria-label="Toggle sidenav"
            mat-icon-button
            (click)="toggleSidenav()"
            class="sidenav-toggle">
            <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
          </button>
          
          <span class="toolbar-title">Project Management Tool</span>
          
          <span class="toolbar-spacer"></span>
          
          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>
          
          <mat-menu #userMenu="matMenu">
            <div mat-menu-item class="user-info">
              <mat-icon>person</mat-icon>
              <span>{{ currentUser?.username }}</span>
            </div>
            <div mat-menu-item class="user-info">
              <mat-icon>email</mat-icon>
              <span>{{ currentUser?.email }}</span>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Déconnexion</span>
            </button>
          </mat-menu>
        </mat-toolbar>
        
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: 250px;
      background-color: #f5f5f5;
      border-right: 1px solid #e0e0e0;
    }

    .sidenav-toolbar {
      background-color: #3f51b5;
      color: white;
      font-size: 18px;
      font-weight: 500;
      padding: 16px;
    }

    .app-title {
      margin-left: 8px;
    }

    .sidenav-content {
      display: flex;
      flex-direction: column;
    }

    .main-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .sidenav-toggle {
      margin-right: 16px;
    }

    .toolbar-title {
      font-size: 18px;
      font-weight: 500;
    }

    .toolbar-spacer {
      flex: 1 1 auto;
    }

    .content {
      padding: 20px;
      flex: 1;
      overflow-y: auto;
      background-color: #fafafa;
    }

    .active {
      background-color: rgba(63, 81, 181, 0.1);
      color: #3f51b5;
      border-right: 3px solid #3f51b5;
    }

    .notification-badge {
      margin-left: auto;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      font-size: 14px;
      color: #666;
    }

    .user-info mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .sidenav {
        width: 280px;
      }
      
      .toolbar-title {
        font-size: 16px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  @ViewChild('drawer') drawer: any;
  
  currentUser: User | null = null;
  unreadCount = 0;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadUnreadNotifications();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidenav(): void {
    this.drawer.toggle();
  }

  closeSidenav(): void {
    if (this.drawer && this.drawer.mode === 'over') {
      this.drawer.close();
    }
  }

  private loadUnreadNotifications(): void {
    if (this.currentUser?.id) {
      this.notificationService.getUnreadNotifications(this.currentUser.id).subscribe({
        next: (notifications) => {
          this.unreadCount = notifications.length;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des notifications:', error);
        }
      });
    }
  }

  navigateToProjects(): void {
    this.router.navigate(['/dashboard/projects']);
    this.closeSidenav();
  }

  navigateToTasks(): void {
    this.router.navigate(['/dashboard/tasks']);
    this.closeSidenav();
  }

  navigateToNotifications(): void {
    this.router.navigate(['/dashboard/notifications']);
    this.closeSidenav();
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }
} 