import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './shared/components/navbar/navbar';
import { NotificationComponent } from './shared/components/notifications/notifications';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        NavbarComponent,
        NotificationComponent
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {

}