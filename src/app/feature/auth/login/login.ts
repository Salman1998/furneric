import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  loading: boolean = false;
  rememberMe: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (!this.email || !this.password) return;
    // this.loading = true;
    this.authService.login(this.email, this.password)
    .subscribe({
      next: () => {
        // this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        // this.loading = false;
        console.error('Login failed:', err);
        alert('Login failed. Please check your credentials.');
      },
    });
  }

  async loginWithGoogle() {
    const user = await this.authService.loginWithGoogle(this.rememberMe);
    if (user) {
      this.router.navigate(['/home'])
    }
  }

  loginWithMicrosoft() {
    this.loading = true;
    this.authService.loginWithMicrosoft().subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Microsoft login failed:', err);
        alert('Microsoft login failed.');
      },
    });
  }
}