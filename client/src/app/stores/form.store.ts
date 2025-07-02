import {computed, inject, Signal, signal, WritableSignal} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import {BaseStore} from "./base.store";
import {FormBuilder, FormGroup} from "@angular/forms";
import {toSignal} from "@angular/core/rxjs-interop";

export abstract class FormStore extends BaseStore {

    protected fb = inject(FormBuilder);

    form!: FormGroup;
    formValid!: Signal<"VALID" | "INVALID" | string>;
    readonly isFormValid = computed(() => this.formValid() === 'VALID');

    protected initializeForm(form: FormGroup) {
        this.form = form;
        this.formValid = toSignal(this.form.statusChanges, {
            initialValue: this.form.valid ? 'VALID' : 'INVALID',
        });
    }


    abstract submit(): void;

}
