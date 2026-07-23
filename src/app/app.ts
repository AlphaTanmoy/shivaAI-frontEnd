import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from './shared/components/navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from './shared/components/notifications/notifications';
import { HealthService } from './core/services/HealthService';
import { NotificationService } from './core/services/NotificationService';
import { NotificationAppearance } from './core/enums/NotificationAppearance';
import { NotificationType } from './core/enums/NotificationType';
import { NotificationAction } from './core/enums/NotificationAction';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, NotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  constructor(
    private healthService: HealthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.healthService.checkBackend().subscribe({

      next: () => {

        this.notificationService.open({

          message: 'Backend connected.',

          appearance: NotificationAppearance.TOP,

          type: NotificationType.INFO,

          action: null

        });

      },

      error: () => {

        this.notificationService.open({

          message: 'Unable to connect to the backend server.',

          appearance: NotificationAppearance.TOP,

          type: NotificationType.ERROR,

          action: NotificationAction.CLOSE

        });

      }

    });
  }

}