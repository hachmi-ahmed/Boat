import { Injectable, computed, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Injectable({ providedIn: 'root' })
export class LoginStore {
    constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {}

    // 1. Reactive Form
    form = this.fb.group({
        email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
        password: ['', [Validators.required]],
    });

    // 2. Convert reactive form states to signals
    email = toSignal(this.form.get('email')!.valueChanges, { initialValue: '' });
    password = toSignal(this.form.get('password')!.valueChanges, { initialValue: '' });
    formValid = toSignal(this.form.statusChanges.pipe(), {
        initialValue: this.form.valid ? 'VALID' : 'INVALID',
    });

    get emailControl() {
        return this.form.get('email');
    }

    get passwordControl() {
        return this.form.get('password');
    }

    // 3. Other UI state
    loading = signal(false);
    error = signal<string | null>(null);
    success = signal(false);

    // 4. Public signals
    readonly isFormValid = computed(() => this.formValid() === 'VALID');

    // 5. Submit logic
    submit() {
        if (!this.form.valid) {
            this.error.set('Please correct the form');
            return;
        }
        this.loading.set(true);
        this.error.set(null);
        const payload = this.form.getRawValue();
        this.authService.login(payload?.email, payload?.password).subscribe({
            next: (response) => {
                this.success.set(true);
                this.loading.set(false);
                if (response.status !== 200) {
                    throw new Error(response.message || 'Login failed failed');
                }
                this.authService.setUser(response);
                this.router.navigate(['*overview']);
            },
            error: err => {
                this.error.set(err.error?.message || 'Login failed');
                this.loading.set(false);
            }
        });
    }
}
