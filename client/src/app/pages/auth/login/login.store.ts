import { Injectable,  inject } from '@angular/core';
import {  Validators } from '@angular/forms';
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
import { FormStore } from "../../../stores/form.store";

@Injectable({ providedIn: 'any' })
export class LoginStore extends FormStore {

    private router = inject(Router);
    private authService = inject(AuthService);

    constructor() {
        super();
        this.initializeForm(
            this.fb.group({
                email: ['', [Validators.required]],
                password: ['', [Validators.required]],
                rememberMe: [false],
            })
        );
    }

    get emailControl() {
        return this.form.get('email');
    }

    get passwordControl() {
        return this.form.get('password');
    }

    get rememberMeControl() {
        return this.form.get('rememberMe');
    }

    async submit() {
        if (!this.form.valid) {
            this.alertError('COMMON.FORM_INVALID');
            return;
        }
        this.loading.set(true);
        const payload = this.form.getRawValue();
        try {
            this.loading.set(true);
            const user = await this.authService.login(payload?.email, payload?.password, payload.rememberMe);
            this.loading.set(false);
            this.authService.setUser(user);
            await this.router.navigate(['*overview']);
        } catch (error) {
            this.loading.set(false);
            console.error('Login failed:', error);
        }
        /*this.authService.login(payload?.email, payload?.password).subscribe({
            next: (response) => {
                this.loading.set(false);
                if (response.status !== 200) {
                    throw new Error(response.message || 'Login failed failed');
                }
                this.authService.setUser(response);
                this.router.navigate(['*overview']);
            },
            error: err => {
                this.loading.set(false);
            }
        });*/
    }
}
