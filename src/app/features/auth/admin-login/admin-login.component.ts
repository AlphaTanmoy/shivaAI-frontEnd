import { Component } from '@angular/core';

import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {}
