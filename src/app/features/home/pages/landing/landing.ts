import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar';
import { FooterComponent } from '../../../../shared/components/footer/footer';
import { HeroComponent } from '../../../../shared/components/hero/hero';
import { Features } from '../../../../shared/components/features/features';
import { Models } from '../../../../shared/components/models/models';
import { Faq } from '../../../../shared/components/faq/faq';

@Component({
  selector: 'app-landing',
  imports: [NavbarComponent,FooterComponent,HeroComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {}
