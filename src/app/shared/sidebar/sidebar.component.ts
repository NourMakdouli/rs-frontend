import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to current user data
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }

  // Method to check if the user has the MERCHANT role
  isMerchant(): boolean {
    return this.currentUser?.role === 'MERCHANT';
  }
}
