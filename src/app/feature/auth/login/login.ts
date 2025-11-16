import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingService } from '../../../core/services/loading.service';

import { ToastService } from '../../../core/services/toast';

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

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private loadingService: LoadingService,
    private toast: ToastService
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

async onLogin() {
  this.loadingService.show();

  try {
    if (!this.email || !this.password) {
      this.toast.show('Email and Password are required', 'error');
      return;
    }

    const result = await this.authService.login(
      this.email,
      this.password,
      this.rememberMe
    );

    if (result.success) {
      this.toast.show('Login successfully!', 'success');
      this.router.navigate(['/home']);
    }else {
    this.toast.show(result.error ?? 'Something went wrong', 'error');
  }

  } catch (error) {
    console.error('Unexpected error in login:', error);
    this.toast.show('Something went wrong. Try again.', 'error');

  } finally {
    this.loadingService.hide();
  }
}



async loginWithGoogle() {
      this.loadingService.show();

  try {
    const result = await this.authService.loginWithGoogle(this.rememberMe);

    if (result.success) {
      this.toast.show('Login successfully!', 'success');
      this.router.navigate(['/home']);
    }else {
    this.toast.show(result.error ?? 'Something went wrong', 'error');
  }

  } catch (error) {
    console.error('Unexpected error in login:', error);
    this.toast.show('Something went wrong. Try again.', 'error');

  } finally {
    this.loadingService.hide();
  }
}

async loginWithMicrosoft() {
  this.toast.show('Microsoft login is not available yet!', 'info')
}
  
}