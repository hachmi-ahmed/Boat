import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { TranslateModule } from '@ngx-translate/core';
import { CapitalizeFirstPipe } from '../../../pipes/CapitalizeFirstPipe';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, TranslateModule, CapitalizeFirstPipe],
  template: `
    <div class="max-w-4xl mx-auto mt-20  bg-white rounded-lg shadow-md overflow-hidden">
      <div class="bg-indigo-600 h-32"></div>
      <div class="px-6 py-2 -mt-20">
        <div class="flex items-center">
          <img 
            [src]="'/assets/img/profile.jpg'"
            class="w-32 h-32 rounded-full border-4 border-white object-cover"
            [alt]="'ADMIN_PROFILE_PAGE.PROFILE_IMAGE_ALT' | translate"
          >
          <div class="ml-6  mt-8">
            <h1 class="text-2xl font-bold text-white">{{ user?.firstName | capitalizeFirst }} {{ user?.lastName | capitalizeFirst }}</h1>
            <p class="text-gray-600">{{ 'ADMIN_PROFILE_PAGE.ROLE' | translate }}  : {{ user?.role }}</p>
          </div>
        </div>
        
        <div class="mt-6">
          <h3 class="font-semibold mb-2">{{ 'ADMIN_PROFILE_PAGE.CONTACT_INFO_TITLE' | translate }}</h3>
          <p class="text-gray-600">{{user?.email}}</p>
        </div>
      </div>
    </div>
  `
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }
}
