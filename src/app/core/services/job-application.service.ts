import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JobApplication } from '../models/job-application';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {
  private apiUrl = `${environment.API_URL}/job-applications`;

  constructor(private http:HttpClient) { }

  getJobApplications(): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(this.apiUrl);
  }

  getJobApplicationById(id: string): Observable<JobApplication> {
    return this.http.get<JobApplication>(`${this.apiUrl}/${id}`);
  }

  createJobApplication(jobApplication: JobApplication): Observable<JobApplication> {
    return this.http.post<JobApplication>(this.apiUrl, jobApplication);
  }

  updateJobApplication(id: string, jobApplication: Partial<JobApplication>): Observable<JobApplication> {
    return this.http.patch<JobApplication>(`${this.apiUrl}/${id}`, jobApplication);
  }

  deleteJobApplication(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getApplicationsByJobOffer(jobOfferId: string): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.apiUrl}/by-job-offer/${jobOfferId}`);
  }
}
