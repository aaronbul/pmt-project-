import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="notifications-container">
      <div class="header">
        <h1>Notifications</h1>
        <button mat-raised-button color="primary" (click)="markAllAsRead()">
          <mat-icon>mark_email_read</mat-icon>
          Tout marquer comme lu
        </button>
      </div>

      <div class="notifications-list" *ngIf="notifications.length > 0; else noNotifications">
        <mat-card *ngFor="let notification of notifications" 
                  class="notification-card"
                  [class.unread]="!notification.isRead">
          <mat-card-header>
            <mat-card-title>{{ notification.title }}</mat-card-title>
            <mat-card-subtitle>
              {{ notification.createdAt | date:'dd/MM/yyyy HH:mm' }}
            </mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <p>{{ notification.message }}</p>
            <div class="notification-meta">
              <mat-chip [color]="notification.isRead ? 'primary' : 'warn'" selected>
                {{ notification.isRead ? 'Lu' : 'Non lu' }}
              </mat-chip>
              <mat-chip color="accent" selected>
                {{ notification.type }}
              </mat-chip>
            </div>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-button color="primary" 
                    *ngIf="!notification.isRead"
                    (click)="markAsRead(notification.id!)">
              <mat-icon>mark_email_read</mat-icon>
              Marquer comme lu
            </button>
            <button mat-button>
              <mat-icon>delete</mat-icon>
              Supprimer
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <ng-template #noNotifications>
        <div class="no-notifications">
          <mat-icon class="no-notifications-icon">notifications_none</mat-icon>
          <h2>Aucune notification</h2>
          <p>Vous n'avez pas encore de notifications.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .notifications-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header h1 {
      margin: 0;
      color: #333;
    }

    .notifications-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .notification-card {
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }

    .notification-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .notification-card.unread {
      border-left: 4px solid #f44336;
      background-color: #fafafa;
    }

    .notification-meta {
      margin-top: 16px;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .no-notifications {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-notifications-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .no-notifications h2 {
      margin: 16px 0;
      color: #333;
    }

    .no-notifications p {
      font-size: 16px;
    }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  loading = false;
  currentUser: any = null;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadNotifications();
  }

  loadNotifications(): void {
    if (!this.currentUser?.id) return;

    this.loading = true;
    this.notificationService.getNotificationsByUser(this.currentUser.id).subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des notifications:', error);
        this.loading = false;
      }
    });
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        this.loadNotifications();
      },
      error: (error) => {
        console.error('Erreur lors du marquage comme lu:', error);
      }
    });
  }

  markAllAsRead(): void {
    if (!this.currentUser?.id) return;

    this.notificationService.markAllAsRead(this.currentUser.id).subscribe({
      next: () => {
        this.loadNotifications();
      },
      error: (error) => {
        console.error('Erreur lors du marquage de toutes les notifications:', error);
      }
    });
  }
} 