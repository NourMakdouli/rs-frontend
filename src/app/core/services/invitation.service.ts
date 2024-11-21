import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  private apiUrl = `${environment.API_URL}/invitation-link`;

  constructor(private http: HttpClient) { }



  getShareableLink(): Observable<string> {
    return this.http.get(`${this.apiUrl}/invitations/shareable-link`, { responseType: 'text' });
  }

  getReferralCode(userId: string): Observable<{ code: string }> {
    return this.http.get<{ code: string }>(`${this.apiUrl}/user-referral/${userId}`);
  }
  
  

  // Send an invitation

  sendInvitation(invitationData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, invitationData);
  }
}
