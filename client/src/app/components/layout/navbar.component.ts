import {Component, effect} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import {NzButtonComponent} from "ng-zorro-antd/button";
import { NzIconModule } from 'ng-zorro-antd/icon';
import {TranslateModule, TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, NzButtonComponent, NzIconModule, TranslateModule],
  template: `
    <nav class="bg-white fixed top-0 inset-x-0 shadow z-50" >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center pointer">
              <img routerLink="/" src="/assets/img/logo.png" width="110px" height="40px">
            </div>
          </div>

          <div class="flex items-center space-x-4">

            <div class="dropdown">
              <button
                  type="button"
                  class="dropdown-button shadow"
                  (click)="toggleDropdown('language', $event)"
              >
                <i class="fas fa-globe text-gray-600 mr-2"></i>  {{ language }}
   
              </button>
              <div class="dropdown-menu" *ngIf="activeDropdown === 'language'">
                <button
                    type="button"
                    *ngFor="let lang of supportedLanguages"
                    (click)="changeLanguage(lang.code)"
                    class="dropdown-item"
                    [class.active]="currentLang === lang.code"
                >
                  {{ lang.name }}
                </button>
              </div>
            </div>
            
            <ng-container *ngIf="!authService.isAuthenticated(); else loggedIn">
              <a routerLink="/login" class="text-gray-700 hover:text-indigo-600 px-3 py-2">{{ 'NAVBAR.LOGIN' | translate }}</a>
              <a routerLink="/register" class="bg-indigo-600 text-white px-4 py-2 rounded-md">{{ 'NAVBAR.SIGN_UP' | translate }}</a>
            </ng-container>

            <ng-template #loggedIn>
              <div class="flex items-center space-x-3">
                <ng-container *ngIf="authService.getCurrentUser()">
                  <button nz-button nzType="default"  [routerLink]="getDashboardPath()">{{ 'NAVBAR.DASHBOARD' | translate }}</button>
                  <a
                      [routerLink]="getProfilePath()"
                      class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-indigo-700"
                  >
                    {{ getInitials() }}
                  </a>
                </ng-container>

                <button
                    (click)="authService.logout()"
                    class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition duration-200"
                    aria-label="Logout"
                >
                  <i class="fa-solid fa-right-from-bracket text-gray-700 text-xl"></i>
                </button>

              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles:`
  .dropdown {
      position: relative;
    }

    .dropdown-button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 8px 12px;
      border-radius: 6px;
      background: white;
      color: black;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .dropdown-button:hover {
      border-color: gray;
    }

    .dropdown-button svg {
      opacity: 0.5;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin-top: 4px;
      background: white;
      border: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }

    .dropdown-item {
      width: 100%;
      padding: 12px;
      border: none;
      background: none;
      color: black;
      font-size: 1rem;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .dropdown-item:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    .dropdown-item.active {
      background: rgb(79, 70, 229);
      color: white;
    }
  `
})
export class NavbarComponent {

  isAdmin:boolean=false;
  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' }
  ];
  currentLang: string;
  language: string;
  activeDropdown:string | null = '';

  constructor(public authService: AuthService,private translate: TranslateService) {
    effect(() => {
      const user = this.authService.currentUserSignal();
      this.isAdmin = user?.role === 'ROLE_ADMIN';
    });
    translate.addLangs(['en', 'fr']);
    const browserLang = translate.getBrowserLang();
    const defaultLang = browserLang?.match(/en|fr/) ? browserLang : 'en';
    this.currentLang = defaultLang;
    this.language = this.currentLang==='en'? 'English' : 'Francais';
    translate.setDefaultLang(defaultLang);
    translate.use(defaultLang);
  }

  toggleDropdown(type: string, event: Event) {
    event.stopPropagation();
    this.activeDropdown = this.activeDropdown === type ? null : type;
  }

  changeLanguage(langCode: any): void {
    this.translate.use(langCode);
    this.currentLang = langCode;
    this.activeDropdown= null;
    this.language = this.currentLang==='en'? 'English' : 'Francais';
  }


  getInitials(): string {
    const user = this.authService.getCurrentUser();
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  getProfilePath(): string {
    const user = this.authService.getCurrentUser();
    return user?.role === 'ROLE_USER' ? '/user/profile' : '/admin/profile';
  }

  getDashboardPath(): string {
    const user = this.authService.getCurrentUser();
    return user?.role === 'ROLE_USER' ? '/user/dashboard' : '/admin/dashboard';
  }
}
