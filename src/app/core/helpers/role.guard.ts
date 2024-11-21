import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUserValue;
  const allowedRoles = route.data['roles'] as Array<string>; // Get the allowed roles from route data

  if (currentUser && allowedRoles.includes(currentUser.role)) {
    return true; // If the user's role is allowed, grant access
  }

  // If the user's role is not allowed, redirect to login or another page
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false; // Deny access
};
