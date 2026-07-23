import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    BehaviorSubject,
    interval
} from 'rxjs';

import { API } from '../constants/api-list';
import { NotificationService } from './NotificationService';
import { NotificationType } from '../enums/NotificationType';
import { NotificationAppearance } from '../enums/NotificationAppearance';

@Injectable({
    providedIn: 'root'
})
export class HealthService {

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
        private http: HttpClient,
        private zone: NgZone,
        private notificationService: NotificationService
    ) {

        this.checkBackend();

        interval(30000).subscribe(() => {

            this.checkBackend();

        });

    }

    checkBackend(): void {

        this.zone.run(() => {

            this.checkingSubject.next(true);

        });

        this.http.get(API.HEALTH).subscribe({

            next: () => {

                this.zone.run(() => {

                    this.backendStatusSubject.next(true);
                    this.checkingSubject.next(false);

                    if (this.previousStatus !== true) {

                        this.notificationService.open({

                            message: 'Connected to Shiva AI Backend.',

                            appearance: NotificationAppearance.TOP,

                            type: NotificationType.SUCCESS,

                            action: null

                        });

                    }

                    this.previousStatus = true;

                });

            },

            error: () => {

                this.zone.run(() => {

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

                });

            }

        });

    }

}