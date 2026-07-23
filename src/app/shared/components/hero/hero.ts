import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { BackendStatusService } from '../../../features/chat/services/BackendStatusService';

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
    private backendStatusService: BackendStatusService
  ) { }

  ngOnInit(): void {

    this.backendStatusService.backendStatus$
      .subscribe(status => {

        console.log("Backend Status:", status);

        this.isBackendOnline = status;

      });

    this.backendStatusService.checking$
      .subscribe(checking => {

        console.log("Checking:", checking);

        this.checkingConnection = checking;

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