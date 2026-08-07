import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../../../core/services/AuthApiService';
import { AuthService } from '../../../core/services/AuthService';
import { EnumService, ENUM_NAMES } from '../../../core/services/EnumService';
import { NotificationAppearance } from '../../../core/enums/NotificationAppearance';
import { NotificationType } from '../../../core/enums/NotificationType';
import { NotificationService } from '../../../core/services/NotificationService';
import {
  DropdownOption,
  SingleSelectDropdownComponent
} from '../../../core/shared/custom-dropdown/single-select-dropdown';

@Component({
  selector: 'app-two-factor',
  standalone: true,
  imports: [CommonModule, FormsModule, SingleSelectDropdownComponent],
  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.scss']
})
export class TwoFactorComponent implements OnInit, OnDestroy {
  private readonly authApiService = inject(AuthApiService);
  private readonly authService = inject(AuthService);
  private readonly enumService = inject(EnumService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  options: DropdownOption[] = [];
  selectedChannel: string | null = null;
  loading = false;
  showOtpEntry = false;
  otpCode = '';
  otpBoxes: string[] = ['', '', '', '', '', ''];
  countdown = 0;

  private countdownTimer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.loadOtpDeliveryChannels();
  }

  ngOnDestroy(): void {
    this.clearCountdownTimer();
  }

  onChannelSelected(channel: string | null): void {
    this.selectedChannel = channel;
  }

  sendOtp(): void {
    if (!this.selectedChannel) {
      this.notificationService.open({
        message: 'Please select a delivery channel first.',
        appearance: NotificationAppearance.TOP,
        type: NotificationType.WARNING,
        action: null
      });
      return;
    }

    if (this.countdown > 0) {
      return;
    }

    this.loading = true;
    this.authApiService.twoFactorInit(this.selectedChannel).subscribe({
      next: () => {
        this.loading = false;
        this.showOtpEntry = true;
        this.changeDetectorRef.detectChanges();
        this.startCountdown();
        this.notificationService.open({
          message: 'OTP sent. Enter it below to continue.',
          appearance: NotificationAppearance.TOP,
          type: NotificationType.SUCCESS,
          action: null
        });
      },
      error: (error) => {
        this.loading = false;
        this.notificationService.open({
          message: this.extractErrorMessage(error),
          appearance: NotificationAppearance.TOP,
          type: NotificationType.ERROR,
          action: null
        });
      }
    });
  }

  openOtpEntry(): void {
    this.showOtpEntry = true;
  }

  onOtpBoxChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.otpBoxes = [...this.otpBoxes];
    this.otpBoxes[index] = value.replace(/\D/g, '').slice(0, 1);

    this.updateOtpCode();

    if (this.otpBoxes[index] && index < 5) {
      this.focusOtpBox(index + 1);
    }
  }

  onOtpBoxBackspace(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;

    if (!input.value && index > 0) {
      this.focusOtpBox(index - 1);
    }

    this.changeDetectorRef.detectChanges();
  }

  onOtpBoxArrowLeft(event: Event, index: number): void {
    if (index > 0) {
      this.focusOtpBox(index - 1);
    }

    this.changeDetectorRef.detectChanges();
  }

  onOtpBoxArrowRight(event: Event, index: number): void {
    if (index < this.otpBoxes.length - 1) {
      this.focusOtpBox(index + 1);
    }

    this.changeDetectorRef.detectChanges();
  }

  onOtpBoxPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') ?? '';
    const digits = pastedText.replace(/\D/g, '').slice(0, 6);

    if (!digits) {
      return;
    }

    for (let i = 0; i < this.otpBoxes.length; i++) {
      this.otpBoxes[i] = digits[i] ?? '';
    }

    this.updateOtpCode();

    const focusIndex = Math.min(digits.length, this.otpBoxes.length - 1);
    this.focusOtpBox(focusIndex);
    this.changeDetectorRef.detectChanges();
  }

  get isOtpComplete(): boolean {
    const complete = this.otpBoxes.every(box => box.length === 1);
    console.log(this.otpBoxes, complete);
    return complete;
  }

  submitOtp(): void {
    if (!this.isOtpComplete) {
      this.notificationService.open({
        message: 'Please enter a 6-digit OTP.',
        appearance: NotificationAppearance.TOP,
        type: NotificationType.WARNING,
        action: null
      });
      return;
    }

    if (!this.selectedChannel) {
      this.notificationService.open({
        message: 'Missing delivery channel. Please restart the flow.',
        appearance: NotificationAppearance.TOP,
        type: NotificationType.WARNING,
        action: null
      });
      return;
    }

    this.loading = true;
    this.authApiService.validateTwoFactorOTP(this.otpCode, this.selectedChannel).subscribe({
      next: (response) => {
        const newAccessToken = response?.token ?? response?.accessToken;
        const newRefreshToken = response?.refreshToken ?? response?.refresh_token;

        if (!newAccessToken?.trim()) {
          this.loading = false;
          this.notificationService.open({
            message: 'Verification succeeded but no token was returned.',
            appearance: NotificationAppearance.TOP,
            type: NotificationType.ERROR,
            action: null
          });
          return;
        }

        this.authService.setTokens(newAccessToken, newRefreshToken);

        this.authApiService.getProfile().subscribe({
          next: () => {
            this.loading = false;
            this.notificationService.open({
              message: 'Two-factor authentication successful.',
              appearance: NotificationAppearance.TOP,
              type: NotificationType.SUCCESS,
              action: null
            });
            this.router.navigateByUrl('/chat');
          },
          error: (profileError) => {
            this.loading = false;
            this.notificationService.open({
              message: this.extractErrorMessage(profileError),
              appearance: NotificationAppearance.TOP,
              type: NotificationType.ERROR,
              action: null
            });
          }
        });
      },
      error: (error) => {
        this.loading = false;
        this.notificationService.open({
          message: this.extractErrorMessage(error),
          appearance: NotificationAppearance.TOP,
          type: NotificationType.ERROR,
          action: null
        });
      }
    });
  }

  private updateOtpCode(): void {
    this.otpCode = this.otpBoxes.join('');
  }

  private focusOtpBox(index: number): void {
    const boxes = document.querySelectorAll<HTMLInputElement>('.otp-box');
    boxes[index]?.focus();
  }

  private startCountdown(): void {
    this.clearCountdownTimer();
    this.countdown = 60;

    this.countdownTimer = setInterval(() => {
      this.countdown--;

      this.changeDetectorRef.detectChanges();

      if (this.countdown <= 0) {
        this.clearCountdownTimer();
      }
    }, 1000);
  }

  private clearCountdownTimer(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  private loadOtpDeliveryChannels(): void {
    this.enumService.getEnum(ENUM_NAMES.OTP_DELIVERY_CHANNEL).subscribe({
      next: (response) => {
        const channels = Array.isArray(response?.data) ? response.data : [];
        this.options = channels
          .map((channel: any): DropdownOption => ({
            label: channel?.name ?? channel?.code,
            value: channel?.code ?? ''
          }))
          .filter((option: DropdownOption) => option.value);

        if (!this.options.length) {
          this.notificationService.open({
            message: 'No OTP delivery channels are available.',
            appearance: NotificationAppearance.TOP,
            type: NotificationType.WARNING,
            action: null
          });
        }
      },
      error: (error) => {
        this.notificationService.open({
          message: this.extractErrorMessage(error),
          appearance: NotificationAppearance.TOP,
          type: NotificationType.ERROR,
          action: null
        });
      }
    });
  }

  private extractErrorMessage(error: any): string {
    const rawError = error?.error;

    if (typeof rawError === 'string') {
      try {
        const parsed = JSON.parse(rawError);
        return parsed?.errorMessage || parsed?.message || error?.message || 'Something went wrong.';
      } catch {
        return rawError || error?.message || 'Something went wrong.';
      }
    }

    if (rawError && typeof rawError === 'object') {
      return rawError?.errorMessage || rawError?.message || error?.message || 'Something went wrong.';
    }

    return error?.message || 'Something went wrong.';
  }
}