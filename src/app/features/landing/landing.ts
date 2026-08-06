import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../core/shared/footer/footer';
import { HeroComponent } from '../../core/shared/hero/hero';
import { NavbarComponent } from '../../core/shared/navbar/navbar';

@Component({
  selector: 'app-landing',
  imports: [NavbarComponent, FooterComponent, HeroComponent, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {}
