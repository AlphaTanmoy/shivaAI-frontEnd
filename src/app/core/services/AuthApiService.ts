import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoginRequest } from '../models/LoginRequest';
import { environment } from '../../../environments/environment';

export interface LoginResponse {
  token?: string;
  refreshToken?: string;
  accessToken?: string;
  refresh_token?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string, userType: 'ADMIN' | 'CUSTOMER'): Observable<LoginResponse> {
    const payload: LoginRequest = {
      emailId: email,
      password,
      clientDevicePlatform: this.getClientDevicePlatform(),
      deviceUserAgent: navigator.userAgent,
      uniqueIdentifierId: this.getOrCreateUniqueIdentifier(),
      fcmId: '',
      userType
    };

    const url = `${environment.apiUrl}/login/email`;
    return this.http.post<LoginResponse>(url, payload);
  }

  private getClientDevicePlatform(): string {
    const userAgent = navigator.userAgent;

    if (/Windows/i.test(userAgent)) {
      return 'WINDOWS_DESKTOP';
    }

    if (/Mac/i.test(userAgent)) {
      return 'MAC_DESKTOP';
    }

    if (/Android/i.test(userAgent)) {
      return 'ANDROID_MOBILE';
    }

    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      return 'IOS_MOBILE';
    }

    return 'UNKNOWN';
  }

  private getOrCreateUniqueIdentifier(): string {
    const storageKey = 'shivaai.uniqueIdentifierId';
    const existing = localStorage.getItem(storageKey);

    if (existing?.trim()) {
      return existing;
    }

    const generated = crypto.randomUUID();
    localStorage.setItem(storageKey, generated);
    return generated;
  }
}
