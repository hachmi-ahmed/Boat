import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {RegisterStore} from "./register.store";
import {FormControlErrorsComponent} from "../../../components/forms/form-control-errors.component";

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, NzRadioModule, FormControlErrorsComponent],
    template: `
        <div class="max-w-md mx-auto bg-white p-10 mt-20 rounded-lg shadow">
            <h2 class="text-2xl font-bold mb-6 text-center">{{ 'REGISTER_PAGE.TITLE' | translate }}</h2>

            <form [formGroup]="store.form" (ngSubmit)="onSubmit()">
                <div class="mb-4">
                    <label class="block text-gray-700 mb-2">{{ 'REGISTER_PAGE.ROLE_LABEL' | translate }}</label>
                    <nz-radio-group formControlName="role" nzButtonStyle="solid">
                        <label nz-radio-button nzValue="ROLE_USER">{{ 'REGISTER_PAGE.ROLE_USER' | translate }}</label>
                        <label nz-radio-button nzValue="ROLE_ADMIN">{{ 'REGISTER_PAGE.ROLE_ADMIN' | translate }}</label>
                    </nz-radio-group>
                </div>

                <div class="mb-4">
                    <label for="firstName"
                           class="block text-gray-700 mb-2">{{ 'REGISTER_PAGE.FIRST_NAME_LABEL' | translate }}</label>
                    <input
                            type="text"
                            id="firstName"
                            formControlName="firstName"
                            placeholder="{{ 'REGISTER_PAGE.FIRST_NAME_LABEL' | translate }}"
                            class="w-full px-3 py-2 border rounded-md"
                    >
                    <form-control-errors [control]="store.firstNameControl"></form-control-errors>
                </div>

                <div class="mb-4">
                    <label for="lastName"
                           class="block text-gray-700 mb-2">{{ 'REGISTER_PAGE.LAST_NAME_LABEL' | translate }}</label>
                    <input
                            type="text"
                            id="lastName"
                            formControlName="lastName"
                            placeholder="{{ 'REGISTER_PAGE.LAST_NAME_LABEL' | translate}}"
                            class="w-full px-3 py-2 border rounded-md"
                    >
                    <form-control-errors [control]="store.lastNameControl"></form-control-errors>
                </div>

                <div class="mb-4">
                    <label for="email"
                           class="block text-gray-700 mb-2">{{ 'REGISTER_PAGE.EMAIL_LABEL' | translate }}</label>
                    <input
                            type="email"
                            id="email"
                            formControlName="email"
                            placeholder="{{ 'REGISTER_PAGE.EMAIL_LABEL' | translate}}"
                            class="w-full px-3 py-2 border rounded-md"
                    >
                    <form-control-errors [control]="store.emailControl"></form-control-errors>
                </div>

                <div class="mb-4">
                    <label for="password"
                           class="block text-gray-700 mb-2">{{ 'REGISTER_PAGE.PASSWORD_LABEL' | translate }}</label>
                    <input
                            type="password"
                            id="password"
                            formControlName="password"
                            placeholder="{{ 'REGISTER_PAGE.PASSWORD_LABEL' | translate}}"
                            class="w-full px-3 py-2 border rounded-md"
                    >
                    <form-control-errors [control]="store.passwordControl"></form-control-errors>
                </div>

              <div class="mb-4">
                <label for="password"
                       class="block text-gray-700 mb-2">{{ 'REGISTER_PAGE.CONFIRM_PASSWORD_LABEL' | translate }}</label>
                <input
                    type="password"
                    id="confirmPassword"
                    formControlName="confirmPassword"
                    placeholder="{{ 'REGISTER_PAGE.PASSWORD_LABEL' | translate}}"
                    class="w-full px-3 py-2 border rounded-md"
                >
                <form-control-errors [control]="store.confirmPasswordControl"></form-control-errors>
              </div>

                <button
                        type="submit"
                        class="w-full mt-10 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        [disabled]="!store.isFormValid() || store.loading()">
                    {{ 'REGISTER_PAGE.REGISTER_BUTTON' | translate }}
                </button>
            </form>
        </div>
    `
})
export class RegisterComponent {

    constructor(
        protected store: RegisterStore
    ) {
    }

    async onSubmit() {
        await this.store.submit();
    }
}
