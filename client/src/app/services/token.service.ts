import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private readonly USER_KEY = 'user_key';
    private readonly TOKEN_KEY = 'token_key';

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    getUser(): User | null {
        const userJson = localStorage.getItem(this.USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }

    setUser(user: User): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    removeUser(): void {
        localStorage.removeItem(this.USER_KEY);
    }

    clear(): void {
        this.removeToken();
        this.removeUser();
    }
}
