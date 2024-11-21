import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Blog } from '../models/blog';
@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private apiUrl = `${environment.API_URL}/blogs`;

  constructor(private http: HttpClient) {}


  updateBlog(id: string, blogData: Partial<Blog>): Observable<Blog> {
    return this.http.patch<Blog>(`${this.apiUrl}/${id}`, blogData);
  }

  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrl);
  }


  getBlogById(id: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/${id}`);
  }
// Method to get a blog by owner ID
getBlogByOwner(ownerId: string): Observable<Blog> {
  return this.http.get<Blog>(`${this.apiUrl}/owner/${ownerId}`);
}
  deleteBlog(id: string): Observable<{ status: number; message: string }> {
    return this.http.delete<{ status: number; message: string }>(`${this.apiUrl}/${id}`);
  }
}
