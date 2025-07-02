import {computed, Injectable, signal} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import {firstValueFrom, Observable} from 'rxjs';
import { ResponseData } from '../models/response.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TokenService } from './token.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private readonly API_URL = '/api/auth';

  constructor(
      private router: Router,
      private http: HttpClient,
      private message: NzMessageService,
      private tokenService: TokenService,
      private translate: TranslateService
  ) {
    const storedUser = this.tokenService.getUser();
    if (storedUser) {
      this.currentUser.set(storedUser);
    }
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }

  /*login(email: any, password: any): Observable<ResponseData> {
    return this.http.post<ResponseData>(`${this.API_URL}/login`, { email, password });
  }*/

  async login(email: string, password: string, rememberMe: boolean): Promise<User> {
    const response = await firstValueFrom(
        this.http.post<ResponseData>(`${this.API_URL}/login`, { email, password, rememberMe })
    );
    if (response.status !== 200) {
      throw new Error(response.message || 'Login failed failed');
    } 
    this.tokenService.setToken(response.data.token);

    const user: User = this.initUser(response.data);
    this.tokenService.setUser(user);
    this.currentUser.set(user);

    await this.router.navigate(['*overview']);
    return user;
  }


  async register(user: User): Promise<User> {
      const response = await firstValueFrom(this.http.post<ResponseData>(`${this.API_URL}/register`, user));
      if(response.status===200){
        return this.login(user.email ?? '', user.password!, false);
     }else{
        throw new Error(response.message || 'Registration failed');
      }
  }

  async logout() {
    this.tokenService.clear();
    this.currentUser.set(null);
    const response = await firstValueFrom(
        this.http.post<ResponseData>(`${this.API_URL}/logout`, {}, { withCredentials: true })
    );
    location.reload();
    //this.router.navigate(['/login']);
    return Promise.resolve();
  }

  async refreshToken(): Promise<string> {
    try {
      const response = await firstValueFrom(
          this.http.post<ResponseData>(`${this.API_URL}/refresh`, {}, { withCredentials: true })
      );

      if (response.status === 200 && response.data.token) {
        this.tokenService.setToken(response.data.token);
        const user: User = this.initUser(response.data);
        this.tokenService.setUser(user);
        this.currentUser.set(user);
        return response.data.token;
      }

      throw new Error('No access token returned');
    } catch (error) {
      await this.logout();
      throw error;
    }
  }

  async refreshTokenOnStartup(): Promise<boolean> {
    try {
      await this.refreshToken();
      return true;
    } catch {
      this.tokenService.clear();
      return false;
    }
  }

  setUser(response:any){
    this.tokenService.setToken(response.data.token);
    const user: User = this.initUser(response.data);
    this.tokenService.setUser(user);
    this.currentUser.set(user);
  }

  initUser(data:any){
    return {
      id: data.id,
      email: data.email,
      role: data.role as 'ROLE_USER' | 'ROLE_ADMIN',
      firstName: data.firstName,
      lastName: data.lastName
    };
  }

  readonly isAuthenticated = computed(() => {
    console.log("isAuthenticated")
    return this.currentUser() !== null; });

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  get currentUserSignal() {
    return this.currentUser;
  }

  alertSuccess(key:string){
    this.message.success(this.translate.instant(key), { nzDuration: 5000 });
  }

  alertError(key:string){
    this.message.error(this.translate.instant(key), { nzDuration: 5000 });
  }

}
