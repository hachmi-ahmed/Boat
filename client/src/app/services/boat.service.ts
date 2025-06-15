import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Boat} from "../models/boat.model";
import { ResponseData } from '../models/response.model';

@Injectable({
    providedIn: 'root'
})
export class BoatService {
    private baseUrl = '/api/boats';

    constructor(private http: HttpClient) {}


    createOrSaveBoat(boat:Boat): Observable<ResponseData> {
        return this.http.post<ResponseData>(`${this.baseUrl}`, boat);
    }

    getBoats(): Observable<ResponseData> {
        return this.http.get<ResponseData>(`${this.baseUrl}`);
    }

     getBoatsImagesUrls(): Observable<ResponseData> {
        return this.http.get<ResponseData>(`${this.baseUrl}/image-urls`);
    }

    getBoatsByUserId(userId: any): Observable<ResponseData> {
        return this.http.get<ResponseData>(`${this.baseUrl}/users/${userId}`);
    }

    getBoatById(boatId: number): Observable<ResponseData> {
        return this.http.get<ResponseData>(`${this.baseUrl}/${boatId}`);
    }

    deleteBoatById(boatId: any): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${boatId}`);
    }
}
