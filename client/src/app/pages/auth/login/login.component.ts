import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {FormControlErrorsComponent} from "../../../components/forms/form-control-errors.component";
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import {LoginStore} from "./login.store";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, FormControlErrorsComponent, NzCheckboxModule],
  template: `
    <div class="max-w-md mx-auto bg-white p-10 mt-20 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">{{ 'LOGIN_PAGE.TITLE' | translate }}</h2>
      
      <form [formGroup]="store.form" (ngSubmit)="onSubmit()">
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
          <form-control-errors [control]="store.emailControl"></form-control-errors>        
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
          <form-control-errors [control]="store.passwordControl"></form-control-errors>
        </div>
        <div class="mb-6">
          <label nz-checkbox formControlName="rememberMe">{{ 'LOGIN_PAGE.REMEMBER_ME_LABEL' | translate }}</label>
        </div>
        <button type="submit"
                class="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                [disabled]="!store.isFormValid() || store.loading()">
          {{ store.loading() ? 'Logging in...' : 'LOGIN_PAGE.LOGIN_BUTTON' | translate }}
        </button>
        
      </form>
    </div>
  `
})
export class LoginComponent {

  constructor(
      protected store: LoginStore
  ) {}

  onSubmit() {
    this.store.submit();
  }
}
