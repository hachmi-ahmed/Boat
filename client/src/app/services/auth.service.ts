import {computed, Injectable, signal} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import {firstValueFrom, Observable} from 'rxjs';
import { ResponseData } from '../models/response.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StorageService } from './storage.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _currentUser = signal<User | null>(null);
  currentUser = this._currentUser.asReadonly();
  isLoggedIn = computed(() => this.currentUser() !== null);
  private readonly API_URL = '/api/auth';

  constructor(
      private router: Router,
      private http: HttpClient,
      private message: NzMessageService,
      private storageService: StorageService,
      private translate: TranslateService
  ) {
    const storedUser = this.storageService.getUser();
    if (storedUser) {
      this._currentUser.set(storedUser);
    }
  }

  /*login(email: any, password: any): Observable<ResponseData> {
    return this.http.post<ResponseData>(`${this.API_URL}/login`, { email, password });
  }*/

  async login(email: string, password: string, rememberMe: boolean): Promise<void> {
    const response = await firstValueFrom(
        this.http.post<ResponseData>(`${this.API_URL}/login`, { email, password, rememberMe })
    );
    if (response.status !== 200) {
      throw new Error(response.message || 'Login failed failed');
    }
    this.setUserAndSaveToken(response);
  }


  async register(user: User): Promise<void> {
      const response = await firstValueFrom(this.http.post<ResponseData>(`${this.API_URL}/register`, user));
      if(response.status===200){
        await this.login(user.email ?? '', user.password!, false);
     }else{
        throw new Error(response.message || 'Registration failed');
      }
  }

  async logout() {
    await firstValueFrom(this.http.post<ResponseData>(`${this.API_URL}/logout`, {}, { withCredentials: true }));
    this.clear();
    location.reload();
    //this.router.navigate(['/login']);
    return Promise.resolve();
  }

  async refreshToken(): Promise<string> {
    try {
      const response = await firstValueFrom(
          this.http.post<ResponseData>(`${this.API_URL}/refresh`, {}, { withCredentials: true })
      );
      //if (response.status === 200 && response.data.token) {
        this.setUserAndSaveToken(response);
        return response.data.token;
      //}

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
      this.clear();
      return false;
    }
  }

  setUserAndSaveToken(response:any){
    this.storageService.setToken(response.data.token);
    const user: User = this.initUser(response.data);
  }

  initUser(data:any){
    const user:User = {
      id: data.id,
      email: data.email,
      role: data.role as 'ROLE_USER' | 'ROLE_ADMIN',
      firstName: data.firstName,
      lastName: data.lastName
    };
    this.storageService.setUser(user);
    this._currentUser.set(user);
    return user;
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  getToken(): string | null {
    return this.storageService.getToken();
  }

  refresh(){
    this._currentUser.set(this.currentUser());
  }

  clear(){
    this._currentUser.set(null);
    this.storageService.clear();
  }

  alertSuccess(key:string){
    this.message.success(this.translate.instant(key), { nzDuration: 5000 });
  }

  alertError(key:string){
    this.message.error(this.translate.instant(key), { nzDuration: 5000 });
  }

}
