import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from './core/shared/notifications/notifications';
import { NavbarComponent } from './core/shared/navbar/navbar';

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