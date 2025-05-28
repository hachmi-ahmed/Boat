import {inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ResponseData } from '../models/response.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  
  constructor(private message: NzMessageService, private translate: TranslateService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {    
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse 
          && event.url?.indexOf('api')!==-1 
          && event.url?.indexOf('public')===-1
          && (event.body as ResponseData).notify) {
           const response = event.body as ResponseData  ;
           if(response.status!==200){
              this.alertError(response.key || (response.message?? response));
           }else{
              this.alertSuccess(response.key || (response.message?? response));
           }
        }
      }),
    catchError(err => {
      // Handle HTTP error (like 404, 500, etc.)
      const message =
        err.error?.message || err.message || 'An unknown error occurred';
      this.alertError('COMMON.UNKNOWN');
      return throwError(() => err);
    })
    );
  }

  alertSuccess(key: string): void {
    this.message.success(this.translate.instant(key), { nzDuration: 5000 });
  }

  alertError(key: string): void {
    this.message.error(this.translate.instant(key), { nzDuration: 5000 });
  }
}
