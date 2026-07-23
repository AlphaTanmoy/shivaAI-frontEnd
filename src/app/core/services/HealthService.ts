import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API } from '../constants/api-list';

@Injectable({
    providedIn: 'root'
})
export class HealthService {

    constructor(
        private http: HttpClient
    ) {}

    checkBackend(): Observable<any> {

        return this.http.get(API.HEALTH);

    }

}