// src/app/shared/header/header.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';
import { Product } from '../../core/models/product';
import { User } from 'src/app/core/models/user';
import { Notification, NotificationType } from 'src/app/core/models/notification';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  cartCount: number = 0;
  wishlistCount: number = 0;
  wishlistProduct: Product[] | undefined;
  notifications: Notification[] = [];
  private subscriptions: Subscription = new Subscription();

  user: User | null = null;

  typeToColor: { [key in NotificationType]: string } = {
    [NotificationType.ORDER]: 'blue',
    [NotificationType.STOCK]: 'red',
    [NotificationType.TOKEN]: 'purple',
    [NotificationType.PAYMENT]: 'green',
    [NotificationType.JOB]: 'pink',
    [NotificationType.REVIEW]: 'orange',
    [NotificationType.PROMOTION]: 'yellow',
    [NotificationType.MESSAGE]: 'teal',
    [NotificationType.OTHER]: 'gray',
  };


  constructor(
    public authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const authSub = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
      this.updateSidebarClass();
      if (isAuthenticated) {
        this.initializeUserData();
      } else {
        this.clearUserData();
      }
    });
    this.subscriptions.add(authSub);

    this.isAuthenticated = this.authService.isAuthenticated;
    if (this.isAuthenticated) {
      this.initializeUserData();
    }
    this.cartCount = this.cartService.getCartCount();
    const cartSub = this.cartService.cartUpdated.subscribe((count: number) => {
      this.cartCount = count;
    });
    this.subscriptions.add(cartSub);
  }

  private initializeUserData(): void {
    this.user = this.authService.currentUserValue;
    this.cartCount = this.cartService.getCartCount();
    this.wishlistProduct = this.user?.favorites || [];
    this.wishlistCount = this.wishlistProduct.length;
    console.log('The user favorites:', this.user?.favorites);
  
    if (this.user?._id) {
      // Connect to Notification Service
      this.notificationService.connect(this.user._id);
      console.log('Connected to NotificationService with user ID:', this.user._id);
  
      // Fetch initial notifications
      const httpSub = this.notificationService.getUserNotifications(this.user._id).subscribe({
        next: (notifications) => {
          console.log('Fetched notifications:', notifications);
          // Avoid duplications by replacing the array
          this.notifications = notifications || [];
        },
        error: (error) => {
          console.error('Error fetching notifications:', error);
        },
      });
      this.subscriptions.add(httpSub);
  
      // Listen for new notifications in real time
      const notifSub = this.notificationService.getNotifications().subscribe((notification) => {
        console.log('New real-time notification:', notification);
  
        // Add the new notification only if it's not a duplicate
        if (!this.notifications.some((n) => n._id === notification._id)) {
          this.notifications.unshift(notification);
        }
      });
      this.subscriptions.add(notifSub);
    }
  
    // Listen for cart updates
    const cartSub = this.cartService.cartUpdated.subscribe((count: number) => {
      this.cartCount = count;
    });
    this.subscriptions.add(cartSub);
  }
  

  private clearUserData(): void {
    this.user = null;
    this.cartCount = 0;
    this.wishlistProduct = [];
    this.wishlistCount = 0;
    this.notifications = [];
    this.notificationService.disconnect();
    console.log('Disconnected from NotificationService');
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.notificationService.disconnect();
  }

  accessWishlist() {
    if (this.isAuthenticated) {
      this.router.navigate(['/wishlist']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  toggle() {
    if (this.isAuthenticated) {
      document.body.classList.toggle('toggle-sidebar');
    }
  }

  updateSidebarClass() {
    if (this.isAuthenticated) {
      document.body.classList.add('sidebar-active');
    } else {
      document.body.classList.remove('sidebar-active');
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getNotificationColor(type: NotificationType): string {
    return this.typeToColor[type] || 'gray';
  }



  get unreadNotificationsCount(): number {
    return this.notifications.filter(notification => !notification.read).length;
  }
  





  markAsRead(notification: Notification) {
    if (notification._id && this.user?._id) {
      this.notificationService.markAsRead(notification._id, this.user._id).subscribe({
        next:(updatedNotification) => {
          const index = this.notifications.findIndex((n) => n._id === updatedNotification._id);
          if (index !== -1) {
            this.notifications[index].read = true;
          }
        },
        error:(error) => {
          console.error('Error marking notification as read:', error);
        }
    });
    }
  }
}
