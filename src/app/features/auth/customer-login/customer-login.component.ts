import { Component } from '@angular/core';

import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-customer-login',
  standalone: true,
  imports: [LoginComponent],
  template: `<app-login [userType]="'CUSTOMER'"></app-login>`
})
export class CustomerLoginComponent {}
