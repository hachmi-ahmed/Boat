import {Injectable, Signal, inject} from '@angular/core';
import {AbstractControl, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
import {FormStore} from "../../../stores/form.store";
import {User} from "../../../models/user.model";

@Injectable({ providedIn: 'any' })
export class RegisterStore extends FormStore {

    private authService = inject(AuthService);


    constructor() {
        super();

        const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
            const password = group.get('password')?.value;
            const confirmPassword = group.get('confirmPassword')?.value;
            return password === confirmPassword ? null : { passwordMismatch: true };
        };
        this.initializeForm(
            this.fb.group({
                role: ['ROLE_USER', Validators.required],
                firstName: ['', [Validators.required, Validators.maxLength(50)]],
                lastName: ['', [Validators.required, Validators.maxLength(50)]],
                email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
                password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)]],
                confirmPassword: ['', [Validators.required]],
            }, { validators: passwordMatchValidator })
        );
    }

    get firstNameControl() {
        return this.form.get('firstName');
    }

    get lastNameControl() {
        return this.form.get('lastName');
    }

    get emailControl() {
        return this.form.get('email');
    }

    get passwordControl() {
        return this.form.get('password');
    }

    get confirmPasswordControl() {
        const control = this.form.get('confirmPassword');
        if (this.form.errors?.['passwordMismatch']) {
            control?.setErrors({ ...control.errors, passwordMismatch: true });
        } else {
            if (control?.hasError('passwordMismatch')) {
                const { passwordMismatch, ...rest } = control.errors ?? {};
                control.setErrors(Object.keys(rest).length ? rest : null);
            }
        }
        return control;
    }

    async submit() {
        if (this.form.invalid) {
            this.alertError('REGISTER_PAGE.ERROR_ALL_FIELDS');
            return;
        }
        const user: User = this.form.value;
        await this.authService.register(user);
    }

}
