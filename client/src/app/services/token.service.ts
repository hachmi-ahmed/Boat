import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private readonly USER_KEY = 'user_key';
    private readonly TOKEN_KEY = 'token_key';

    getToken(): string | null {
        return sessionStorage.getItem(this.TOKEN_KEY);
    }

    setToken(token: string): void {
        sessionStorage.setItem(this.TOKEN_KEY, token);
    }

    removeToken(): void {
        sessionStorage.removeItem(this.TOKEN_KEY);
    }

    getUser(): User | null {
        const userJson = sessionStorage.getItem(this.USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }

    setUser(user: User): void {
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    removeUser(): void {
        sessionStorage.removeItem(this.USER_KEY);
    }

    clear(): void {
        this.removeToken();
        this.removeUser();
    }
}
