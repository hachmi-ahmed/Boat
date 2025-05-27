import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, NzRadioModule],
  template: `
    <div class="max-w-md mx-auto bg-white p-10 mt-20 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-6 text-center">{{ 'REGISTER_PAGE.TITLE' | translate }}</h2>
      
      <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ errorMessage }}
      </div>
      
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">{{ 'REGISTER_PAGE.ROLE_LABEL' | translate }}</label>
          <nz-radio-group formControlName="role" nzButtonStyle="solid">
            <label nz-radio-button nzValue="ROLE_USER">{{ 'REGISTER_PAGE.ROLE_USER' | translate }}</label>
            <label nz-radio-button nzValue="ROLE_ADMIN">{{ 'REGISTER_PAGE.ROLE_ADMIN' | translate }}</label>
          </nz-radio-group>
        </div>

        <div class="mb-4">
          <label for="firstName" class="block text-gray-700 mb-2">{{ 'REGISTER_PAGE.FIRST_NAME_LABEL' | translate }}</label>
          <input
            type="text"
            id="firstName"
            formControlName="firstName"
            placeholder="{{ 'FORM.REQUIRED' | translate }} {{ 'VALIDATION.USER_INFO_FIRSTNAME' | translate}}"
            class="w-full px-3 py-2 border rounded-md"
          >
        </div>

        <div class="mb-4">
          <label for="lastName" class="block text-gray-700 mb-2">{{ 'REGISTER_PAGE.LAST_NAME_LABEL' | translate }}</label>
          <input
            type="text"
            id="lastName"
            formControlName="lastName"
            placeholder="{{ 'FORM.REQUIRED' | translate }} {{ 'VALIDATION.USER_INFO_LASTNAME' | translate}}"
            class="w-full px-3 py-2 border rounded-md"
          >
        </div>

        <div class="mb-4">
          <label for="email" class="block text-gray-700 mb-2">{{ 'REGISTER_PAGE.EMAIL_LABEL' | translate }}</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            placeholder="{{ 'FORM.REQUIRED' | translate }} {{ 'VALIDATION.USER_INFO_EMAIL' | translate}}"
            class="w-full px-3 py-2 border rounded-md"
          >
        </div>

        <div class="mb-4">
          <label for="password" class="block text-gray-700 mb-2">{{ 'REGISTER_PAGE.PASSWORD_LABEL' | translate }}</label>
          <input
            type="password"
            id="password"
            formControlName="password"
            placeholder="{{ 'FORM.REQUIRED' | translate }} {{ 'VALIDATION.USER_INFO_PASSWORD' | translate}}"
            class="w-full px-3 py-2 border rounded-md"
          >
        </div>

        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          [disabled]="registerForm.invalid"
        >
          {{ 'REGISTER_PAGE.REGISTER_BUTTON' | translate }}
        </button>
      </form>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.registerForm = this.fb.group({
      role: ['ROLE_USER', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = this.translate.instant('REGISTER_PAGE.ERROR_ALL_FIELDS');
      return;
    }

    const user: User = this.registerForm.value;
    await this.authService.register(user);
  }
}
