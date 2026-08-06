import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API } from '../constants/api-list';

export const ENUM_NAMES = {
  TRAINING_STATUS: 'TrainingStatus',
  OTP_DELIVERY_CHANNEL: 'OtpDeliveryChannel'
  // Add additional enum names here as needed
} as const;

export type EnumNameKey = keyof typeof ENUM_NAMES;
export type EnumName = typeof ENUM_NAMES[EnumNameKey];

@Injectable({
  providedIn: 'root'
})
export class EnumService {
  private readonly http = inject(HttpClient);

  getEnumNames(): EnumName[] {
    return Object.values(ENUM_NAMES);
  }

  getEnum(enumName: EnumName): Observable<any> {
    return this.http.get<any>(`${API.ENUMS}/${enumName}`);
  }
}
