import { Component } from '@angular/core';

import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [LoginComponent],
  template: `<app-login [userType]="'ADMIN'"></app-login>`
})
export class AdminLoginComponent {}
