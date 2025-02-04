import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FetchServiceService } from '../fetch-service.service'

@Component({
  selector: 'app-login',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  name: string = '';
  email: string = '';

  constructor(private apiService: FetchServiceService, private router: Router) {}

  onSubmit() {
    const userInfo = { name: this.name, email: this.email };
    this.apiService.login(userInfo).subscribe({
      next: (response) => {
        if (response === 'OK') {
          this.router.navigate(['/landing-page']);
        }
      },
      error: (err) => {
        console.error('Authentication failed', err);
      }
    });
  }
}
