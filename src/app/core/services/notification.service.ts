// src/app/core/services/notification.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { Notification } from 'src/app/core/models/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private baseUrl = 'http://localhost:3000/notifications';
  constructor(private socket: Socket, private http: HttpClient) {}

  connect(userId: string) {
    this.socket.connect();

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.socket.emit('join', { userId });
      console.log(`Emitted join event for userId: ${userId}`);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  getNotifications(): Observable<Notification> {
    return this.socket.fromEvent<Notification>('notification');
  }

  disconnect() {
    this.socket.disconnect();
  }

  getUserNotifications(userId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/${userId}`);
  }
  
  markAsRead(notificationId: string, userId: string): Observable<Notification> {
    return this.http.patch<Notification>(
      `${this.baseUrl}/mark-as-read/${notificationId}`,
      { userId }
    );
  }
}
