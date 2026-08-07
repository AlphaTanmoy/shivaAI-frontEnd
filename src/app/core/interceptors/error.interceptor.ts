import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationAppearance } from '../enums/NotificationAppearance';
import { NotificationType } from '../enums/NotificationType';
import { NotificationService } from '../services/NotificationService';

interface BackendErrorResponse {
  errorMessage?: string;
  code?: number | string;
  type?: string;
  message?: string;
}


@Injectable({ providedIn: 'root' })
export class ErrorInterceptor implements HttpInterceptor {

  private readonly routeByErrorCode: Record<number, string[]> = {
  403010: ['/change-password'],
  403012: ['/two-factor'],
  401: ['/login'],
  403: ['/']
};

  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {

        const backendError = this.extractError(error);

        this.notificationService.open({
          message: backendError.errorMessage || 'Something went wrong. Please try again.',
          appearance: NotificationAppearance.TOP,
          type: NotificationType.ERROR,
          action: null
        });

        if (backendError.code !== undefined && Number.isFinite(Number(backendError.code))) {
          const route = this.routeByErrorCode[Number(backendError.code)];

          if (route) {
            this.router.navigate(route);
          }
        }

        return throwError(() => backendError);
      })
    );

  }

  private extractError(error: HttpErrorResponse): BackendErrorResponse {

    const rawError = error?.error;
    const payload = this.safeParsePayload(rawError);

    const errorMessage =
      payload?.errorMessage ||
      payload?.message ||
      error?.message ||
      'Something went wrong. Please try again.';

    return {
      errorMessage,
      code: payload?.code,
      type: payload?.type || error?.name || 'UNKNOWN'
    };

  }

  private safeParsePayload(rawError: unknown): BackendErrorResponse | null {

    if (typeof rawError === 'string') {
      try {
        return JSON.parse(rawError) as BackendErrorResponse;
      } catch {
        return null;
      }
    }

    if (rawError && typeof rawError === 'object') {
      return rawError as BackendErrorResponse;
    }

    return null;

  }

}

export const errorInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true
};
