import { Injectable } from '@angular/core';
import {
    HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const isRefreshUrl = req.url.includes('/auth/refresh');
        const token = this.authService.getToken();

        let authReq = req;
        if (token && !isRefreshUrl) {
            authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
        }

        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 && !isRefreshUrl && error.message.indexOf('invalid')!==-1 && error.message.indexOf('null')!==-1) {
                    return from(this.authService.refreshToken()).pipe(
                        switchMap(newToken => {
                            const retryReq = req.clone({
                                headers: req.headers.set('Authorization', `Bearer ${newToken}`)
                            });
                            return next.handle(retryReq);
                        })
                    );
                }
                return throwError(() => error);
            })
        );
    }
}
