import { Component, inject } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private auth = inject(Auth);
  private router = inject(Router);

  constructor(private authService: AuthService){}

  logout() {
    this.authService.logout();
  }
}