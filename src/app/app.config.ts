import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptorProvider } from './core/interceptors/auth.interceptor';
import { errorInterceptorProvider } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    provideHttpClient(
      withInterceptorsFromDi()
    ),

    authInterceptorProvider,
    errorInterceptorProvider
  ],
};