import { Component } from '@angular/core';

import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-customer-login',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './customer-login.component.html',
  styleUrls: ['./customer-login.component.scss']
})
export class CustomerLoginComponent {}
