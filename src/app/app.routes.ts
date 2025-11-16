import { Routes } from '@angular/router';
import { Home } from './feature/home/home';
import { Login } from './feature/auth/login/login';
import { Register } from './feature/auth/register/register';

import { AuthGuard } from './core/guards/auth.guard';
import { TermsAndConditions } from './shared/components/terms-and-conditions/terms-and-conditions';
import { ForgotPassword } from './feature/auth/forgot-password/forgot-password';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home, canActivate: [AuthGuard] },
  { path: 'auth/login', component: Login },
  { path: 'auth/register', component: Register },
  { path: 'auth/forgot-password', component: ForgotPassword },
  { path: 'terms-and-condistion', component: TermsAndConditions },
  { path: '**', redirectTo: 'auth/login' }
];
