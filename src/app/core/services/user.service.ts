import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';  // Updated User interface

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.API_URL}/users`;

  constructor(private http: HttpClient) {}

  getProfile(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile/${userId}`);
  }

  // Update User (which now includes account-related fields)
  updateUser(id: string, updateUserDto: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, updateUserDto);
  }

  // Get User by ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }



  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/change-password`,
      { currentPassword, newPassword },
      { withCredentials: true }
    );
  }
}
