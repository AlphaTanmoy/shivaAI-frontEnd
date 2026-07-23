import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationData } from '../../../core/models/notification.model';
import { NotificationService } from '../../../core/services/NotificationService';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './notifications.html',
    styleUrls: ['./notifications.scss']
})
export class NotificationComponent {

    notification$: Observable<NotificationData | null>;

    constructor(
        private notificationService: NotificationService
    ) {

        this.notification$ = this.notificationService.notification$;

    }

    close(): void {

        this.notificationService.close();

    }

}