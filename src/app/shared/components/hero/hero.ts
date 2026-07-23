import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class HeroComponent {

  prompt = '';

  constructor(
    private router: Router
  ) {}

  startChat(): void {

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