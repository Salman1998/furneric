import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

interface RegisterForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  agreeTerms: FormControl<boolean>;
}

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup<RegisterForm>;
  isSubmitting = false;
  errorMessage = '';
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor() {
    this.registerForm = this.fb.group({
      firstName: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
      lastName: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
      email: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      password: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
      confirmPassword: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
      agreeTerms: this.fb.control(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
    });
  }

  // ✅ Custom Validator
  private passwordsMatch(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  // 👁️ Toggle Password Visibility
  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') this.passwordVisible = !this.passwordVisible;
    else this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  // 🚀 Form Submit
  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const { firstName, lastName, email, password } = this.registerForm.value;

    this.authService.registerUser({ firstName: firstName!, lastName: lastName!, email: email!, password: password!,})
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.message || 'Registration failed. Please try again.';
        }
      });
  }

  // 🧩 Getter for form controls
  get f() {
    return this.registerForm.controls;
  }
}