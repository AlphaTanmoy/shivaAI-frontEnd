import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';

import { ChatService } from './chat.service';
import { NotificationService } from '../../../core/services/NotificationService';

import { NotificationAppearance } from '../../../core/enums/NotificationAppearance';
import { NotificationType } from '../../../core/enums/NotificationType';

@Injectable({
    providedIn: 'root'
})
export class BackendStatusService {

    private backendStatusSubject =
        new BehaviorSubject<boolean>(false);

    readonly backendStatus$ =
        this.backendStatusSubject.asObservable();

    private checkingSubject =
        new BehaviorSubject<boolean>(true);

    readonly checking$ =
        this.checkingSubject.asObservable();

    private previousStatus: boolean | null = null;

    constructor(
        private chatService: ChatService,
        private notificationService: NotificationService
    ) {

        // Initial Check
        this.checkBackend();

        // Every 30 Seconds
        interval(30000).subscribe(() => {

            this.checkBackend();

        });

    }

    checkBackend(): void {

        this.checkingSubject.next(true);

        this.chatService.checkConnection().subscribe({

            next: () => {

                this.backendStatusSubject.next(true);

                this.checkingSubject.next(false);

                if (this.previousStatus !== true) {

                    this.notificationService.open({

                        message: 'Shiva AI Backend is Online.',

                        appearance: NotificationAppearance.TOP,

                        type: NotificationType.INFO,

                        action: null

                    });

                }

                this.previousStatus = true;

            },

            error: () => {

                this.backendStatusSubject.next(false);

                this.checkingSubject.next(false);

                if (this.previousStatus !== false) {

                    this.notificationService.open({

                        message: 'Unable to connect to Shiva AI Backend.',

                        appearance: NotificationAppearance.TOP,

                        type: NotificationType.ERROR,

                        action: null

                    });

                }

                this.previousStatus = false;

            }

        });

    }

}