import {
  ChangeDetectorRef,
  Component,
  OnInit,
  NgZone
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HealthService } from '../../services/HealthService';



@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class HeroComponent implements OnInit {

  prompt = '';

  isBackendOnline = false;

  checkingConnection = true;


  constructor(
    private router: Router,
    private healthService: HealthService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.healthService.backendStatus$
      .subscribe(status => {

        this.zone.run(() => {

          this.isBackendOnline = status;

          this.cdr.markForCheck();

        });

      });


    this.healthService.checking$
      .subscribe(checking => {

        this.zone.run(() => {

          this.checkingConnection = checking;

          this.cdr.markForCheck();

        });

      });

  }



  startChat(): void {

    if (!this.isBackendOnline) {
      return;
    }


    if (!this.prompt.trim()) {
      return;
    }


    this.router.navigate(['/chat'], {

      state: {
        message: this.prompt
      }

    });

  }

}