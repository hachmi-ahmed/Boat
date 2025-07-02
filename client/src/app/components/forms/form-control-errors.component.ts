import {Component, Input} from '@angular/core';
import {AbstractControl, ValidationErrors} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";

@Component({
    selector: 'form-control-errors',
    imports: [CommonModule, TranslateModule],
    standalone: true,
    template: `
        <div *ngIf="control?.touched && control?.invalid" class="text-red-600 text-sm">
            <ng-container [ngSwitch]="true">
                <div *ngSwitchCase="hasError('required')">{{ 'VALIDATION.REQUIRED' | translate }}</div>
                <div *ngSwitchCase="hasError('email')">{{ 'VALIDATION.EMAIL_FORMAT' | translate }}</div>
                <div *ngSwitchCase="hasError('minlength')">{{ 'VALIDATION.MIN_LENGTH' | translate :{ max: getError('minlength')?.requiredLength } }}</div>
                <div *ngSwitchCase="hasError('maxlength')">{{ 'VALIDATION.MAX_LENGTH' | translate :{ max: getError('maxlength')?.requiredLength } }}</div>
                <div *ngSwitchCase="hasError('pattern')">{{ 'VALIDATION.PASSWORD_FORMAT' | translate }}</div>
                <div *ngSwitchCase="hasError('passwordMismatch')">{{ 'VALIDATION.PASSWORD_MISMATCH' | translate }}</div>
            </ng-container>
        </div>
    `
})
export class FormControlErrorsComponent {

    @Input() control: AbstractControl | null = null;

    hasError(errorCode: string): boolean {
        return !!this.control?.hasError(errorCode) && this.control?.dirty;
    }

    getError(errorCode: string): any {
        return this.control?.getError(errorCode);
    }
}
