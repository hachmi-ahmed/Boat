import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = this.authService.getToken();
    if (!token) {
      this.authService.clear();
      this.router.navigate(['/login']);
      return false;
    } else {
      this.authService.refresh();
      if (route.url[0]?.path === 'login' ) {
        this.router.navigate(['/overview']);
        return false;
      }
    }
    return true;
  }
}
