import { inject, signal} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';

export abstract class BaseStore {

    protected message = inject(NzMessageService);
    protected translate = inject(TranslateService);

    loading = signal(false);

    alertSuccess(key: string): void {
        this.message.success(this.translate.instant(key), { nzDuration: 5000 });
    }

    alertError(key: string): void {
        this.message.error(this.translate.instant(key), { nzDuration: 5000 });
    }

}
