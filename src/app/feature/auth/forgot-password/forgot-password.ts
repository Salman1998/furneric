import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingService } from '../../../core/services/loading.service';
import { ToastService } from '../../../core/services/toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {

email: string = '';

  constructor(
    private authService: AuthService,
    private loading: LoadingService,
    private toast: ToastService,
    private router: Router
  ) {}

  async onSubmit() {
    if (!this.email?.trim()) {
      this.toast.show('Email is required', 'error');
      return;
    }

    this.loading.show();

    const result = await this.authService.forgotPassword(this.email);
    this.router.navigate(['/auth/login'])
    this.loading.hide();

    if (result.success) {
      this.toast.show('Password reset link sent to your email.', 'success');
    } else {
      this.toast.show(result.error ?? 'Something went wrong', 'error');
    }
  }
}