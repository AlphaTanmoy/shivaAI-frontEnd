import { BehaviorSubject } from "rxjs";
import { NotificationData } from "../models/notification.model";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private notificationSubject =
        new BehaviorSubject<NotificationData | null>(null);

    notification$ =
        this.notificationSubject.asObservable();

    open(data: NotificationData): void {

        this.notificationSubject.next(data);

    }

    close(): void {

        this.notificationSubject.next(null);

    }

}