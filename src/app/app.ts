import { Component } from '@angular/core';
import { NavbarComponent } from './shared/components/navbar/navbar';
import { HeroComponent } from './shared/components/hero/hero';
import { FooterComponent } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, HeroComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

}