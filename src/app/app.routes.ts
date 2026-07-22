import { Routes } from '@angular/router';
import { Landing } from './features/home/pages/landing/landing';
import { ChatComponent } from './features/chat/components/chat';

export const routes: Routes = [
  {
    path: 'chat',
    component: ChatComponent
  },
  
  {
    path: '',
    component: Landing
  }
];