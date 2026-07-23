import {
  Component,
  OnInit,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { HealthService } from '../../../core/services/HealthService';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent implements OnInit {

  mobileMenuOpen = false;

  isBackendOnline = false;

  constructor(
    private healthService: HealthService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.healthService.backendStatus$
      .subscribe(status => {

        this.isBackendOnline = status;

      });

  }


  toggleMenu(): void {

    this.mobileMenuOpen = !this.mobileMenuOpen;

  }

}