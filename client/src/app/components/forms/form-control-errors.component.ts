import { Component, Input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";

@Component({
    selector: 'form-control-errors',
    imports:[CommonModule, TranslateModule],
    standalone: true,
    template: `
    <div *ngIf="control?.touched && control?.invalid" class="text-red-600 text-sm">
      <ng-container [ngSwitch]="true">
        <div *ngSwitchCase="hasError('required')">{{ 'FORM.REQUIRED' | translate }}</div>
        <div *ngSwitchCase="hasError('email')">   {{ 'VALIDATION.USER_EMAIL_EMAIL' | translate }}</div>
        <div *ngSwitchCase="hasError('minlength')">
          Minimum {{ getError('minlength')?.requiredLength }} characters required.
        </div>
        <div *ngSwitchCase="hasError('maxlength')">
            {{ 'VALIDATION.USER_EMAIL_MAX' | translate }}
        </div>
        <div *ngSwitchCase="hasError('pattern')">Invalid format.</div>
        <div *ngSwitchCase="hasError('custom')">
          {{ getError('custom') }}
        </div>
        <!-- Add more generic messages as needed -->
      </ng-container>
    </div>
  `
})
export class FormControlErrorsComponent {
    @Input() control: AbstractControl | null = null;

    hasError(errorCode: string): boolean {
        return !!this.control?.hasError(errorCode);
    }

    getError(errorCode: string): any {
        return this.control?.getError(errorCode);
    }
}
