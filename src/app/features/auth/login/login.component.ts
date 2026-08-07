import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AuthApiService } from '../../../core/services/AuthApiService';
import { AuthService } from '../../../core/services/AuthService';
import { NotificationAppearance } from '../../../core/enums/NotificationAppearance';
import { NotificationType } from '../../../core/enums/NotificationType';
import { NotificationService } from '../../../core/services/NotificationService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  @Input() userType: 'ADMIN' | 'CUSTOMER' = 'CUSTOMER';

  private readonly formBuilder = inject(FormBuilder);
  private readonly authApiService = inject(AuthApiService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly loginForm = this.formBuilder.nonNullable.group({
    emailId: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  readonly pageTitle = this.userType === 'ADMIN' ? 'Admin Login' : 'Customer Login';
  readonly redirectPath = this.userType === 'ADMIN' ? '/countries' : '/chat';

  private readonly twoFactorErrorCodes = new Set<number>([
    403008,
    403009,
    403010,
    403011,
    403012,
    403013,
    403014
  ]);

  submitting = false;
  hidePassword = true;

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  swapLoginType(): void {
    const targetPath = this.userType === 'ADMIN' ? '/customer/login' : '/admin/login';
    this.router.navigateByUrl(targetPath);
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { emailId, password } = this.loginForm.getRawValue();

    this.submitting = true;

    this.authApiService
      .login(emailId, password, this.userType)
      .pipe(
        finalize(() => {
          this.submitting = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.submitting = false;

          const accessToken = response.token ?? response.accessToken;
          const refreshToken = response.refreshToken ?? response.refresh_token;

          if (!accessToken?.trim()) {
            this.notificationService.open({
              message: 'Login succeeded but no access token was returned.',
              appearance: NotificationAppearance.TOP,
              type: NotificationType.ERROR,
              action: null
            });
            return;
          }

          this.authService.setTokens(accessToken, refreshToken);

          this.authApiService.getProfile().subscribe({
            next: () => {
              this.notificationService.open({
                message: 'Login successful.',
                appearance: NotificationAppearance.TOP,
                type: NotificationType.SUCCESS,
                action: null
              });
              this.router.navigateByUrl(this.redirectPath);
            },
            error: (profileError) => {
              if (this.isTwoFactorError(profileError)) {
                if (this.isTwoFactorRequiredError(profileError)) {
                  this.router.navigateByUrl('/two-factor');
                }
                return;
              }

              const message = this.extractErrorMessage(profileError);

              this.notificationService.open({
                message,
                appearance: NotificationAppearance.TOP,
                type: NotificationType.ERROR,
                action: null
              });
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          this.submitting = false;

          const message = this.extractErrorMessage(error);

          this.notificationService.open({
            message,
            appearance: NotificationAppearance.TOP,
            type: NotificationType.ERROR,
            action: null
          });
        }
      });
  }

  private extractErrorMessage(error: HttpErrorResponse): string {
    const rawError = error?.error;

    if (typeof rawError === 'string') {
      try {
        const parsed = JSON.parse(rawError) as { message?: string; errorMessage?: string };
        return parsed?.errorMessage ?? parsed?.message ?? 'Invalid Credentials';
      } catch {
        return rawError || 'Invalid Credentials';
      }
    }

    if (rawError && typeof rawError === 'object') {
      const payload = rawError as { message?: string; errorMessage?: string };
      return payload?.errorMessage ?? payload?.message ?? 'Invalid Credentials';
    }

    return error?.message || 'Invalid Credentials';
  }

  private isTwoFactorError(error: HttpErrorResponse): boolean {
    const rawError = error?.error;
    const payload = this.parseErrorPayload(rawError);
    const code = payload?.code;

    if (code === undefined || code === null) {
      return false;
    }

    return this.twoFactorErrorCodes.has(Number(code));
  }

  private isTwoFactorRequiredError(error: HttpErrorResponse): boolean {
    const rawError = error?.error;
    const payload = this.parseErrorPayload(rawError);
    const code = payload?.code;

    return Number(code) === 403012;
  }

  private parseErrorPayload(rawError: unknown): { code?: number | string } | null {
    if (typeof rawError === 'string') {
      try {
        return JSON.parse(rawError) as { code?: number | string };
      } catch {
        return null;
      }
    }

    if (rawError && typeof rawError === 'object') {
      return rawError as { code?: number | string };
    }

    return null;
  }
}
