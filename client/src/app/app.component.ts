import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { NavbarComponent } from './components/layout/navbar.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "./components/layout/footer.component";
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, CommonModule, FooterComponent],
  template: `
    <app-navbar />
    <main class="mx-auto px-4 py-8 pb-0" [style.min-height]="'calc(100vh - 52px)'">
      <router-outlet></router-outlet>
    </main>
    <app-footer />
  `
})
export class AppComponent {

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.refreshTokenOnStartup().then(success => {
      if (!success) {
        this.router.navigate(['/login']);
      }else{
        this.router.navigate(['/overview']);
      }
    });
  }

}
