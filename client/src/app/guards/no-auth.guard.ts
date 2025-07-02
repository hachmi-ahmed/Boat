import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    // prevent navigation to login or registraiton page after login or registration
    canActivate(): boolean {
        const token = this.authService.getToken();
        if (token) {
            this.router.navigate(['/overview']);
            return false;
        }
        return true;
    }
}
