import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.API_URL}/auth`;

  // BehaviorSubject to manage authentication state
  private currentUserSubject: BehaviorSubject<User | null>;
  private authStatusListener = new Subject<boolean>();

  // Observable for external access
  public currentUser: Observable<User | null>;

  // Variable to track authentication state
  private isUserAuthenticated = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    
  ) {
    const currentUserJson = localStorage.getItem('currentUser');
    const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;

    this.currentUserSubject = new BehaviorSubject<User | null>(currentUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    return this.isUserAuthenticated;
  }







  register(user: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/register`, user, { withCredentials: true })
      .pipe(
        tap((response) => {
          if (response.emailExists) {
            this.toastr.error('Email already in use', 'Error', {
              progressBar: true,
              closeButton: true,
            });
            throw new Error('Email already in use');
          } else if (response && response.user) {
            this.saveAuthData(response.user);
            this.currentUserSubject.next(response.user);
            this.isUserAuthenticated = true;
            this.authStatusListener.next(true);
            this.router.navigate(['/home']);
          }
          return response;
        })
      );
  }





  autoAuthUser() {
    const currentUserJson = localStorage.getItem('currentUser');

    if (!currentUserJson) {
      this.currentUserSubject.next(null);
      this.isUserAuthenticated = false;
      this.authStatusListener.next(false);
      return;
    }

    const currentUser = JSON.parse(currentUserJson);
    this.currentUserSubject.next(currentUser);
    this.isUserAuthenticated = true;
    this.authStatusListener.next(true);
  }

  saveAuthData(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }





login(email: string, password: string): Observable<any> {
  return this.http
    .post<any>(`${this.apiUrl}/login`, { email, password }, { withCredentials: true })
    .pipe(
      tap((response) => {
        if (response.isTwoFactorEnabled) {
          // 2FA is enabled, prompt for 2FA code
          this.toastr.info('Two-Factor Authentication is enabled. Please enter your 2FA code.', '2FA Required', {
            progressBar: true,
            closeButton: true,
          });
          // Store userId for 2FA verification
          localStorage.setItem('twoFactorUserId', response.userId);
          // Navigate to 2FA verification component
          this.router.navigate(['/2fa-verification']);
        } else if (!response.userfound) {
          this.toastr.error('User not found', 'Error', {
            progressBar: true,
            closeButton: true,
          });
          throw new Error('User not found');
        } else if (!response.passwordIsValid) {
          this.toastr.error('Wrong Password, Please try again', 'Error', {
            progressBar: true,
            closeButton: true,
          });
          throw new Error('Invalid Password');
        } else if (response && response.user) {
          // Handle successful login
          this.handleSuccessfulLogin(response);
        }
      })
    );
}

private handleSuccessfulLogin(response: any) {
  this.saveAuthData(response.user);
  this.currentUserSubject.next(response.user);
  this.isUserAuthenticated = true;
  this.authStatusListener.next(true);
  // Navigate to the desired route after login
  this.router.navigate(['/home']);
}

verifyTwoFactorCode(code: string): Observable<any> {
  const userId = localStorage.getItem('twoFactorUserId');
  if (!userId) {
    this.toastr.error('User ID not found for 2FA verification', 'Error', {
      progressBar: true,
      closeButton: true,
    });
    throw new Error('User ID not found for 2FA verification');
  }

  return this.http
    .post<any>(`${this.apiUrl}/2fa/verify`, { userId, code }, { withCredentials: true })
    .pipe(
      tap((response) => {
        // Clear the stored userId
        localStorage.removeItem('twoFactorUserId');

        if (!response.userfound) {
          this.toastr.error('User not found', 'Error', {
            progressBar: true,
            closeButton: true,
          });
          throw new Error('User not found');
        }

        if (!response.passwordIsValid) {
          this.toastr.error('Invalid 2FA code', 'Error', {
            progressBar: true,
            closeButton: true,
          });
          throw new Error('Invalid 2FA code');
        }

        // Handle successful login
        this.handleSuccessfulLogin(response);
      })
    );
}
generateTwoFactorSecret(): Observable<any> {
  return this.http.post<any>(
    `${this.apiUrl}/2fa/generate`,
    {},
    { withCredentials: true }
  );
}
enableTwoFactorAuthentication(code: string): Observable<any> {
  return this.http.post<any>(
    `${this.apiUrl}/2fa/enable`,
    { code },
    { withCredentials: true }
  ).pipe(
    tap(() => {
      // Update the user's 2FA status
      const currentUser = this.currentUserValue;
      if (currentUser) {
        currentUser.isTwoFactorEnabled = true;
        this.setCurrentUser(currentUser);
      }
    })
  );
}


disableTwoFactorAuthentication(code: string): Observable<any> {
  return this.http
    .post<any>(
      `${this.apiUrl}/2fa/disable`,
      { code },
      { withCredentials: true }
    )
    .pipe(
      tap(() => {
        // Update user's 2FA status
        const currentUser = this.currentUserValue;
        if (currentUser) {
          currentUser.isTwoFactorEnabled = false;
          this.setCurrentUser(currentUser);
        }
      })
    );
}
















  logout() {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe(() => {
      this.clearAuthData();
      this.isUserAuthenticated = false;
      this.authStatusListener.next(false);
      this.currentUserSubject.next(null); 
      this.toastr.info('Logged out successfully', 'Goodbye', {
        progressBar: true,
      });
      this.router.navigate(['/login']);
    });
  }

  private clearAuthData() {
    localStorage.removeItem('currentUser');
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  
    this.saveAuthData(user);
  }
  
}
