import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommonService {
    constructor(private http: HttpClient) {}

    getVersion(): Observable<any> {
        return this.http.get('/actuator/info');
    }
    
    getStats(): Observable<any> {
        return this.http.get('/api/stats');
    }
}
