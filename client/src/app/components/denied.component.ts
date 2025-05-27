import { Component, OnInit } from '@angular/core';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-denied-access',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div class="flex items-center justify-center bg-gray-100 px-4" [style.min-height]="'calc(100vh - 84px)'">
      <div class="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <div class="text-red-500 text-6xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold mb-2">{{ 'COMMON.ACCESS_DENIED'| translate }}</h1>
        <p class="text-gray-600 mb-6">{{ 'COMMON.ACCESS_DENIED_INFO'| translate }}.</p>
      </div>
    </div>
  `
})
export class AccessDeniedComponent {
  constructor(private translate: TranslateService) {}

}
