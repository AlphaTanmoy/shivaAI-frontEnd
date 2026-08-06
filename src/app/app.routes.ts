import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { ChatComponent } from './features/chat/components/chat';
import { CountryComponent } from './core/basepages/countries/countries';
import { authGuard } from './core/gaurds/auth.guard';
import { AdminLoginComponent } from './features/auth/admin-login/admin-login.component';
import { CustomerLoginComponent } from './features/auth/customer-login/customer-login.component';
import { TwoFactorComponent } from './features/auth/two-factor/two-factor.component';

export const routes: Routes = [
  {
    path: 'admin/login',
    component: AdminLoginComponent
  },
  {
    path: 'customer/login',
    component: CustomerLoginComponent
  },
  {
    path: 'two-factor',
    component: TwoFactorComponent
  },
  {
    path: 'chat',
    component: ChatComponent,
  },
  {
    path: 'countries',
    component: CountryComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    component: Landing
  }
];