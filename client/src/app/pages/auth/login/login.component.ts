import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="max-w-md mx-auto bg-white p-10 mt-20 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">{{ 'LOGIN_PAGE.TITLE' | translate }}</h2>
      
      <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ errorMessage }}
      </div>
      
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 mb-2">{{ 'LOGIN_PAGE.EMAIL_LABEL' | translate }}</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="{{ 'LOGIN_PAGE.EMAIL_LABEL' | translate }}"
            formControlName="email"
            class="w-full px-3 py-2 border rounded-md"
          >
          <div *ngIf="loginForm.controls['email'].errors?.['required']  && loginForm.controls['email'].touched" class="text-red-600 text-sm mt-1">
            {{ 'FORM.REQUIRED' | translate }}
          </div>
          <div *ngIf="loginForm.controls['email'].errors?.['email']  && loginForm.controls['email'].touched" class="text-red-600 text-sm mt-1">
           {{ 'VALIDATION.USER_EMAIL_EMAIL' | translate }}
          </div>  
          <div *ngIf="loginForm.controls['email'].errors?.['maxlength']  && loginForm.controls['email'].touched" class="text-red-600 text-sm mt-1">
            {{ 'VALIDATION.USER_EMAIL_MAX' | translate }}
          </div>            
        </div>
        <div class="mb-6">
          <label for="password" class="block text-gray-700 mb-2">{{ 'LOGIN_PAGE.PASSWORD_LABEL' | translate }}</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="{{ 'LOGIN_PAGE.PASSWORD_LABEL' | translate }}"
            formControlName="password"
            class="w-full px-3 py-2 border rounded-md"
          >
          <div *ngIf="loginForm.controls['password'].errors?.['required']  && loginForm.controls['password'].touched" class="text-red-600 text-sm mt-1">
            {{ 'FORM.REQUIRED' | translate }}
          </div>
        </div>
        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          [disabled]="loginForm.invalid"
        >
          {{ 'LOGIN_PAGE.LOGIN_BUTTON' | translate }}
        </button>
      </form>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, , Validators.maxLength(50)]],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password);
  }
}
