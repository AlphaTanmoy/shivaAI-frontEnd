import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AuthApiService } from '../../../core/services/AuthApiService';
import { NotificationAppearance } from '../../../core/enums/NotificationAppearance';
import { NotificationType } from '../../../core/enums/NotificationType';
import { NotificationService } from '../../../core/services/NotificationService';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss'
})
export class ChangePassword {

  private readonly fb = inject(FormBuilder);
  private readonly authApiService = inject(AuthApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  submitting = false;
  hideOldPassword = true;
  hideNewPassword = true;

  readonly form = this.fb.nonNullable.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]]
  });

  toggleOldPassword(): void {
    this.hideOldPassword = !this.hideOldPassword;
  }

  toggleNewPassword(): void {
    this.hideNewPassword = !this.hideNewPassword;
  }

  submit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { oldPassword, newPassword } = this.form.getRawValue();

    this.submitting = true;

    this.authApiService.changePassword(oldPassword, newPassword)
      .pipe(
        finalize(() => this.submitting = false)
      )
      .subscribe({

        next: () => {

          this.authApiService.getProfile().subscribe({

            next: () => {

              this.notificationService.open({
                message: 'Password changed successfully.',
                appearance: NotificationAppearance.TOP,
                type: NotificationType.SUCCESS,
                action: null
              });

              this.router.navigateByUrl('');
            },

            error: () => {
              // ErrorInterceptor handles errors.
            }

          });

        },

        error: () => {
          // ErrorInterceptor handles errors.
        }

      });

  }

}