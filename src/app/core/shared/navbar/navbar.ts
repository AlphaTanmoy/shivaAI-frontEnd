import {
  Component,
  OnInit,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { HealthService } from '../../services/HealthService';



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
  ) {}



  ngOnInit(): void {


    this.healthService.backendStatus$
      .subscribe(status => {


        this.zone.run(() => {


          this.isBackendOnline = status;


          this.cdr.detectChanges();


        });


      });


  }



  toggleMenu(): void {

    this.mobileMenuOpen = !this.mobileMenuOpen;

  }


}