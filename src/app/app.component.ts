import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    console.log('API URL:', environment.API_URL);
    this.authService.autoAuthUser();
  }
}