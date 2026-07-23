import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-spinner.html',
  styleUrls: ['./custom-spinner.scss']
})
export class CustomSpinnerComponent {}
