import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthApiService } from '../../../core/services/AuthApiService';
import { AuthService } from '../../../core/services/AuthService';
import {
  EnumService,
  ENUM_NAMES
} from '../../../core/services/EnumService';

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
  imports: [
    CommonModule,
    FormsModule,
    SingleSelectDropdownComponent
  ],
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

  @ViewChildren('otpInput')
  otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  options: DropdownOption[] = [];
  selectedChannel: string | null = null;

  loading = false;
  showOtpEntry = false;

  otpCode = '';

  otpBoxes: string[] = [
    '',
    '',
    '',
    '',
    '',
    ''
  ];

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

    this.authApiService
      .twoFactorInit(this.selectedChannel)
      .subscribe({

        next: () => {

          this.loading = false;

          this.showOtpEntry = true;

          this.otpBoxes = ['', '', '', '', '', ''];
          this.otpCode = '';

          this.startCountdown();

          setTimeout(() => {
            this.focusOtpBox(0);
          });

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

    setTimeout(() => {
      this.focusOtpBox(0);
    });

  }

  onOtpBoxChange(event: Event, index: number): void {

  const input = event.target as HTMLInputElement;

  const value = input.value.replace(/\D/g, '').substring(0, 1);

  this.otpBoxes[index] = value;

  this.updateOtpCode();

  if (value && index < this.otpBoxes.length - 1) {

    setTimeout(() => {
      this.focusOtpBox(index + 1);
    }, 0);

  }

}

  onOtpBoxBackspace(event: Event, index: number): void {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();

    const input = event.target as HTMLInputElement;

    if (input.value) {
      this.otpBoxes[index] = '';
      this.updateOtpCode();
      return;
    }

    if (index > 0) {
      this.focusOtpBox(index - 1);

      setTimeout(() => {
        this.otpBoxes[index - 1] = '';
        this.updateOtpCode();
      });
    }
  }

  onOtpBoxArrowLeft(event: Event, index: number): void {
    (event as KeyboardEvent).preventDefault();

    if (index > 0) {
      this.focusOtpBox(index - 1);
    }
  }

  onOtpBoxArrowRight(event: Event, index: number): void {
    (event as KeyboardEvent).preventDefault();

    if (index < this.otpBoxes.length - 1) {
      this.focusOtpBox(index + 1);
    }
  }

  onOtpBoxPaste(event: ClipboardEvent): void {

    event.preventDefault();

    const pastedText =
      event.clipboardData?.getData('text') ?? '';

    const digits =
      pastedText.replace(/\D/g, '').slice(0, 6);

    if (!digits.length) {
      return;
    }

    this.otpBoxes.fill('');

    digits.split('').forEach((digit, index) => {
      this.otpBoxes[index] = digit;
    });

    this.updateOtpCode();

    const focusIndex = Math.min(
      digits.length,
      this.otpBoxes.length - 1
    );

    setTimeout(() => this.focusOtpBox(focusIndex));

  }

  onOtpBoxFocus(index: number): void {

    const input = this.otpInputs?.get(index)?.nativeElement;

    if (!input) {
      return;
    }

    input.focus();
    input.select();

    if (!input) {
      return;
    }

    input.select();

  }

  get isOtpComplete(): boolean {
    return this.otpBoxes.every(box => box.length === 1);
  }

  private updateOtpCode(): void {
    this.otpCode = this.otpBoxes.join('');
  }

  private focusOtpBox(index: number): void {

  const input = this.otpInputs.get(index)?.nativeElement;

  if (!input) {
    return;
  }

  input.focus();
  input.select();

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

    this.authApiService
      .validateTwoFactorOTP(
        this.otpCode,
        this.selectedChannel
      )
      .subscribe({

        next: (response) => {

          const newAccessToken =
            response?.token ??
            response?.accessToken;

          const newRefreshToken =
            response?.refreshToken ??
            response?.refresh_token;

          if (!newAccessToken?.trim()) {

            this.loading = false;

            this.notificationService.open({
              message:
                'Verification succeeded but no token was returned.',
              appearance: NotificationAppearance.TOP,
              type: NotificationType.ERROR,
              action: null
            });

            return;
          }

          this.authService.setTokens(
            newAccessToken,
            newRefreshToken
          );

          this.authApiService
            .getProfile()
            .subscribe({

              next: () => {

                this.loading = false;

                this.notificationService.open({
                  message:
                    'Two-factor authentication successful.',
                  appearance:
                    NotificationAppearance.TOP,
                  type:
                    NotificationType.SUCCESS,
                  action: null
                });

                this.router.navigateByUrl('/chat');

              },

              error: (profileError) => {

                this.loading = false;

                this.notificationService.open({
                  message:
                    this.extractErrorMessage(profileError),
                  appearance:
                    NotificationAppearance.TOP,
                  type:
                    NotificationType.ERROR,
                  action: null
                });

              }

            });

        },

        error: (error) => {

          this.loading = false;

          this.notificationService.open({
            message:
              this.extractErrorMessage(error),
            appearance:
              NotificationAppearance.TOP,
            type:
              NotificationType.ERROR,
            action: null
          });

        }

      });

  }

  private startCountdown(): void {

    this.clearCountdownTimer();

    this.countdown = 60;

    this.countdownTimer = setInterval(() => {

      this.countdown--;

      this.changeDetectorRef.markForCheck();

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

    this.enumService
      .getEnum(ENUM_NAMES.OTP_DELIVERY_CHANNEL)
      .subscribe({

        next: (response) => {

          const channels = Array.isArray(response?.data)
            ? response.data
            : [];

          this.options = channels
            .map((channel: any): DropdownOption => ({
              label: channel?.name ?? channel?.code,
              value: channel?.code ?? ''
            }))
            .filter((option: DropdownOption) => !!option.value);

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

        return (
          parsed?.errorMessage ||
          parsed?.message ||
          error?.message ||
          'Something went wrong.'
        );

      } catch {

        return (
          rawError ||
          error?.message ||
          'Something went wrong.'
        );

      }

    }

    if (rawError && typeof rawError === 'object') {

      return (
        rawError?.errorMessage ||
        rawError?.message ||
        error?.message ||
        'Something went wrong.'
      );

    }

    return error?.message || 'Something went wrong.';

  }

  debugInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log('INPUT:', input.value);
  }

  trackByIndex(index: number): number {
  return index;
}

onOtpKeyDown(event: KeyboardEvent, index: number): void {

  switch (event.key) {

    case 'Backspace':
      this.onOtpBoxBackspace(event, index);
      break;

    case 'ArrowLeft':
      this.onOtpBoxArrowLeft(event, index);
      break;

    case 'ArrowRight':
      this.onOtpBoxArrowRight(event, index);
      break;

  }

}
}