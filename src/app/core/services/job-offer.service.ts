import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JobOffer, JobOfferData } from '../models/job-offer';

@Injectable({
  providedIn: 'root'
})
export class JobOfferService {
  private apiUrl = `${environment.API_URL}/job-offers`;

  constructor(private http:HttpClient) { }

  getJobOffers(): Observable<JobOfferData[]> {
    return this.http.get<JobOfferData[]>(this.apiUrl);
  }

getJobOfferById(id: string): Observable<JobOfferData> {
  return this.http.get<JobOfferData>(`${this.apiUrl}/${id}`);
}

createJobOffer(jobOffer: JobOffer): Observable<JobOffer> {
  return this.http.post<JobOffer>(this.apiUrl, jobOffer);
}

updateJobOffer(id: string, jobOffer: Partial<JobOffer>): Observable<JobOffer> {
  return this.http.patch<JobOffer>(`${this.apiUrl}/${id}`, jobOffer);
}

deleteJobOffer(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}

getJobOffersByStore(storeId: string): Observable<JobOffer[]> {
  return this.http.get<JobOffer[]>(`${this.apiUrl}/by-store/${storeId}`);

}
}
