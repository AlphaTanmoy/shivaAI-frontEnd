import { CommonModule } from '@angular/common';
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

  submitting = false;

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

          this.notificationService.open({
            message: 'Login successful.',
            appearance: NotificationAppearance.TOP,
            type: NotificationType.SUCCESS,
            action: null
          });

          this.router.navigateByUrl(this.redirectPath);
        },
        error: () => {
          this.notificationService.open({
            message: 'Unable to login. Please verify your email and password.',
            appearance: NotificationAppearance.TOP,
            type: NotificationType.ERROR,
            action: null
          });
        }
      });
  }
}
