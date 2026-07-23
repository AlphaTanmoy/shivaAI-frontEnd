import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CountryResponse } from '../response/CountryResponse';
import { PaginationResponse } from '../models/PaginationResponse';
import { API } from '../constants/api-list';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private readonly http = inject(HttpClient);

  getCountries(
    queryString?: string,
    limit: number = 20,
    offsetToken?: string,
    serviceable?: boolean,
    giveCount: boolean = true,
    giveData: boolean = true,
    considerMaxDateRange: boolean = false
  ): Observable<PaginationResponse<CountryResponse>> {

    let params = new HttpParams();

    if (queryString?.trim()) {
      params = params.set('queryString', queryString.trim());
    }

    params = params.set('limit', limit);

    params = params.set('giveCount', giveCount);

    params = params.set('giveData', giveData);

    params = params.set(
      'considerMaxDateRange',
      considerMaxDateRange
    );

    if (offsetToken) {
      params = params.set('offsetToken', offsetToken);
    }

    if (serviceable !== undefined && serviceable !== null) {
      params = params.set(
        'serviceable',
        serviceable
      );
    }

    return this.http.get<PaginationResponse<CountryResponse>>(
      API.GET_ALL_COUNTRIES,
      {
        params
      }
    );

  }

}