import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { NotificationData } from '../models/notification.model';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private notificationSubject =
        new BehaviorSubject<NotificationData | null>(null);

    readonly notification$ =
        this.notificationSubject.asObservable();

    private autoCloseTimer: ReturnType<typeof setTimeout> | null = null;

    open(data: NotificationData): void {

        // Cancel previous timer
        if (this.autoCloseTimer) {

            clearTimeout(this.autoCloseTimer);
            this.autoCloseTimer = null;

        }

        this.notificationSubject.next(data);

        // Auto close after 2 seconds only when there is no action button
        if (data.action == null) {

            this.autoCloseTimer = setTimeout(() => {

                this.close();

            }, 2000);

        }

    }

    close(): void {

        if (this.autoCloseTimer) {

            clearTimeout(this.autoCloseTimer);
            this.autoCloseTimer = null;

        }

        this.notificationSubject.next(null);

    }

}