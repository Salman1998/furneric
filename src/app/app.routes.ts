import { Routes } from '@angular/router';
import { Home } from './feature/home/home';
import { Login } from './feature/auth/login/login';
import { Register } from './feature/auth/register/register';

import { AuthGuard } from './core/guards/auth.guard';
import { TermsAndConditions } from './shared/components/terms-and-conditions/terms-and-conditions';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home, canActivate: [AuthGuard] },
  { path: 'auth/login', component: Login },
  { path: 'auth/register', component: Register },
  { path: 'terms-and-condistion', component: TermsAndConditions },
  { path: '**', redirectTo: 'auth/login' }
];
