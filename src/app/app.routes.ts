import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { ChatComponent } from './features/chat/components/chat';
import { CountryComponent } from './core/basepages/countries/countries';

export const routes: Routes = [
  {
    path: 'chat',
    component: ChatComponent
  },

  {
    path: 'countries',
    component: CountryComponent
  },

  {
    path: '',
    component: Landing
  }
];